import { useDriverTracking } from '../hooks/useDriverTracking'; React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useI18n } from './contexts/I18nContext';
import { supabase } from './services/supabaseClient';
import { DeliveryIcon, LocationMarkerIcon } from './contexts/Icons';

const containerStyle = {const { driverLocation, startTracking } = useDriverTracking(orderId);
  width: '100%',
  height: '500px'
};

const center = {
  lat: 21.5424,
  lng: 39.2201
};

export const OrderTrackingPage: React.FC = () => {
  const { language } = useI18n();
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number} | null>(null);
  const [customerLocation, setCustomerLocation] = useState<{lat: number, lng: number}>(center);
  const [orderId, setOrderId] = useState('DS-ORD-1234');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    // Simulate getting customer location from order
    // In a real app, you'd fetch this from your DB
    setCustomerLocation({ lat: 21.5524, lng: 39.2301 });

    // Subscribe to driver location updates
    const channel = supabase
      .channel('driver-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.DS-DRV-99`, // Example driver ID
        },
        (payload) => {
          console.log('Driver location updated:', payload.new);
          setDriverLocation({
            lat: payload.new.lat,
            lng: payload.new.lng
          });
        }
      )
      .subscribe();

    // Initial fetch
    const fetchInitialLocation = async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('lat, lng')
        .eq('id', 'DS-DRV-99')
        .single();
      
      if (data && !error) {
        setDriverLocation({ lat: data.lat, lng: data.lng });
      }
    };

    fetchInitialLocation();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in text-black">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-10 rounded-[4rem] shadow-sovereign border-t-[15px] border-primary mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <DeliveryIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {language === 'ar' ? 'تتبع طلبك مباشرة' : 'Live Order Tracking'}
              </h2>
              <p className="text-sm font-bold text-gray-400">Order ID: {orderId}</p>
            </div>
          </div>

          <div className="rounded-[3rem] overflow-hidden border-4 border-gray-100 shadow-inner">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={driverLocation || customerLocation}
                zoom={14}
              >
                <Marker 
                  position={customerLocation} 
                  label={language === 'ar' ? "أنت" : "You"} 
                />
                {driverLocation && (
                  <Marker 
                    position={driverLocation} 
                    label={language === 'ar' ? "المندوب" : "Driver"}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center animate-pulse">
                <p className="font-black text-gray-400 uppercase tracking-widest">Loading Map...</p>
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Estimated Arrival</p>
              <p className="text-4xl font-black text-slate-800">12 - 18 <span className="text-lg">MIN</span></p>
            </div>
            <div className="bg-primary text-white p-8 rounded-[2.5rem]">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Driver Status</p>
              <p className="text-2xl font-black">
                {driverLocation ? (language === 'ar' ? 'المندوب في الطريق إليك' : 'Driver is on the way') : (language === 'ar' ? 'جاري تحديد موقع المندوب...' : 'Locating driver...')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// داخل OrderTrackingPage.tsx
const { driverLocation, startTracking } = useDriverTracking(orderId);

useEffect(() => {
  if (orderId) {
    startTracking();
  }
}, [orderId, startTracking]);

// في جزء الخريطة (GoogleMap أو Leaflet)
const mapCenter = driverLocation || customerLocation || { lat: 21.5424, lng: 39.2201 };

return (
  <GoogleMap
    mapContainerStyle={containerStyle}
    center={mapCenter}
    zoom={14}
  >
    {/* نقطة العميل */}
    <Marker position={customerLocation} label="أنت" />
    
    {/* نقطة المندوب - تظهر فقط إذا كان هناك موقع */}
    {driverLocation && (
      <Marker 
        position={driverLocation} 
        label="المندوب"
        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
      />
    )}
  </GoogleMap>
);
