import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

export const useLocation = (autoRequest: boolean = true) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const getCurrent = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setLocation(loc);
          setLoading(false);
          resolve(loc);
        },
        (err) => {
          let msg = 'Location error';
          if (err.code === err.PERMISSION_DENIED) msg = 'Please allow location access';
          setError(msg);
          setLoading(false);
          reject(msg);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) return;
    if (watchId) navigator.geolocation.clearWatch(watchId);
    const id = navigator.geolocation.watchPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  }, [watchId]);

  const stopWatching = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    if (autoRequest) startWatching();
    return () => stopWatching();
  }, [autoRequest]);

  return { location, error, loading, getCurrentLocation: getCurrent, startWatching, stopWatching, isWatching: watchId !== null };
};
