import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { orderService } from '../services/orderService';
import { Truck, MapPin, CheckCircle, Package, Clock } from 'lucide-react';

interface OrderTrackingMapProps {
  orderId: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = { lat: 21.5424, lng: 39.2201 };

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ orderId }) => {
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customerLocation, setCustomerLocation] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const loadTracking = async () => {
      const history = await orderService.trackOrder(orderId);
      setTrackingHistory(history);
      if (history.length > 0) {
        setCurrentStatus(history[history.length - 1].status);
      }
    };
    loadTracking();

    // الاشتراك في تحديثات موقع المندوب المباشرة
    const channel = supabase.channel(`order:${orderId}`);
    channel.on('broadcast', { event: 'driver_location' }, (payload) => {
      setDriverLocation(payload.payload);
    }).subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed': return <Package className="w-5 h-5 text-blue-500" />;
      case 'preparing': return <Package className="w-5 h-5 text-purple-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'تم استلام الطلب',
      confirmed: 'تم تأكيد الطلب',
      preparing: 'جاري التجهيز',
      ready: 'الطلب جاهز',
      shipped: 'تم الشحن',
      out_for_delivery: 'الطلب في الطريق إليك',
      delivered: 'تم التسليم بنجاح'
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary" />
          تتبع طلبك رقم {orderId.slice(-8)}
        </h3>
      </div>

      {/* خط زمني لحالات الطلب */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-center">
          {['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered'].map((status, idx) => {
            const isCompleted = trackingHistory.some(h => h.status === status);
            const isCurrent = currentStatus === status;
            return (
              <div key={status} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary animate-pulse' : 'bg-gray-300'
                }`}>
                  {getStatusIcon(status)}
                </div>
                <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                  {getStatusText(status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* الخريطة */}
      <div className="p-6">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={driverLocation || customerLocation}
            zoom={14}
          >
            {customerLocation && (
              <Marker position={customerLocation} label="📍" />
            )}
            {driverLocation && (
              <Marker 
                position={driverLocation} 
                label="🚚"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/truck.png'
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* سجل التتبع */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <h4 className="font-bold mb-4">سجل التحديثات</h4>
        <div className="space-y-3">
          {trackingHistory.slice().reverse().map((track, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm">
              <div className="mt-1">{getStatusIcon(track.status)}</div>
              <div className="flex-1">
                <p className="font-semibold">{getStatusText(track.status)}</p>
                {track.note_ar && <p className="text-gray-500 text-xs">{track.note_ar}</p>}
                <p className="text-gray-400 text-xs">{new Date(track.created_at).toLocaleString('ar-SA')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
