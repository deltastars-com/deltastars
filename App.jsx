import { useEffect } from "react";
import { requestNotificationPermission, listenForMessages } from "./lib/notifications";
import { supabase } from "./lib/supabaseClient";

function App() {
  useEffect(() => {
    // تشغيل الإشعارات بعد تحميل التطبيق
    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await requestNotificationPermission(user.id);
        listenForMessages();
      }
    };
    setupNotifications();
  }, []);

  return (
    // باقي محتوى تطبيقك
    <div>تطبيقك</div>
  );
}

export default App;
import { registerForPush, listenForPush } from "./lib/push-notifications";
import { supabase } from "./lib/supabaseClient";

// حط هالكود داخل الـ App function
useEffect(() => {
  const setup = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await registerForPush(user.id);
      listenForPush();
    }
  };
  setup();
}, []);
