
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from './supabaseClient';

let watchId: string | null = null;

export const startDriverTracking = async (driverId: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear any existing watch
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
    }

    // Check if we have real Supabase config
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

    watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      async (position) => {
        if (!position?.coords) return;

        if (isSupabaseConfigured) {
          try {
            await supabase.from("drivers").update({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              updated_at: new Date().toISOString(),
            }).eq("id", driverId);
          } catch (error) {
            console.error("Error updating driver location:", error);
          }
        } else {
          console.debug("Driver location update skipped: Supabase not configured", position.coords);
        }
      }
    );
  } catch (err) {
    console.error("Failed to start tracking:", err);
  }
};

export const stopDriverTracking = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      watchId = null;
    }
  } catch (err) {
    console.error("Failed to stop tracking:", err);
  }
};
