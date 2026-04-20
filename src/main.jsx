import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// إعدادات الفايربيز الخاصة بمتجر نجوم دلتا
const firebaseConfig = {
  apiKey: "AIzaSyDq63A6ob2MfTudOfnZN94DQCNl3pi0bA0",
  authDomain: "gen-lang-client-0049556086.firebaseapp.com",
  projectId: "gen-lang-client-0049556086",
  storageBucket: "gen-lang-client-0049556086.firebasestorage.app",
  messagingSenderId: "906381862795",
  appId: "1:906381862795:web:ef22df39bcbdc6ccbfb18e"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  useEffect(() => {
    // وظيفة طلب الإذن من المستخدم
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('تم السماح بتلقي الإشعارات ✅');
          
          // الحصول على رمز التوكن (Token) الخاص بجهاز الزبون لإرسال العروض له
          const token = await getToken(messaging, { 
            vapidKey: 'BKh... (ضع هنا مفتاح VAPID من لوحة تحكم Firebase)' 
          });
          
          if (token) {
            console.log('رمز جهاز الزبون (Token):', token);
            // هنا يمكنك إرسال التوكن لقاعدة بياناتك لإرسال العروض لاحقاً
          }
        } else {
          console.log('تم رفض الإشعارات من قبل الزبون ❌');
        }
      } catch (error) {
        console.error('خطأ في طلب إذن الإشعارات:', error);
      }
    };

    requestPermission();

    // استلام الإشعارات والزبون يتصفح المتجر (Foreground)
    onMessage(messaging, (payload) => {
      console.log('وصل إشعار جديد الآن:', payload);
      alert(`عرض جديد: ${payload.notification.title}\n${payload.notification.body}`);
    });
  }, []);

  return (
    // كود المتجر الخاص بك هنا
    <div>مرحباً بك في متجر نجوم دلتا</div>
  );
}

export default App;
