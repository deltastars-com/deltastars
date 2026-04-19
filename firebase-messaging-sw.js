importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// استدعاء القيم من متغيرات البيئة لضمان الأمان
const firebaseConfig = {
  apiKey: "AIzaSy..." , // يفضل وضعها كمتغير بيئة في Netlify
  authDomain: "deltastars-store.firebaseapp.com",
  projectId: "deltastars-store",
  storageBucket: "deltastars-store.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
