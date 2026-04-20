import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { 
            vapidKey: 'BKh...' // ضع مفتاح VAPID هنا
          });
          console.log('Token:', token);
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    };
    requestPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* الهيدر */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b-2 border-green-600">
        <h1 className="text-2xl font-black text-green-700">نجوم دلتا ⭐</h1>
        <div className="flex gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">السلة (0)</button>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-8 rounded-2xl mb-8 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-2">عروض التمور الملكية 🌴</h2>
          <p className="opacity-90">أجود أنواع التمور السعودية تصلك أينما كنت</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* كرت المنتج - يتكرر لكل صنف */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition">
            <div className="h-56 bg-gray-200"></div>
            <div className="p-5">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">سكري مفتل</span>
              <h3 className="text-xl font-bold mt-2">تمر سكري فاخر - 1كجم</h3>
              <p className="text-green-700 font-black text-2xl mt-3">45.00 ر.س</p>
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">إضافة للسلة 🛒</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
