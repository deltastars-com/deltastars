import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { supabase } from '../lib/supabaseClient';

export const useDriverTracking = (orderId?: string) => {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const startTracking = useCallback(() => {
    if (!orderId) return;
    if (unsubscribeRef.current) unsubscribeRef.current();
    const channel = supabase.channel(`order:${orderId}`);
    channel.on('broadcast', { event: 'driver_location' }, (payload) => {
      setDriverLocation(payload.payload);
    }).subscribe();
    unsubscribeRef.current = () => channel.unsubscribe();
    setIsTracking(true);
  }, [orderId]);

  const stopTracking = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsTracking(false);
    setDriverLocation(null);
  }, []);

  useEffect(() => {
    if (orderId) startTracking();
    return () => stopTracking();
  }, [orderId]);

  return { driverLocation, isTracking, startTracking, stopTracking };
};
