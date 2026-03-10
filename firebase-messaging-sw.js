
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

// These values should ideally be injected or fetched, but for now we use placeholders
// as per the user request. In a real app, you'd use environment variables during build.
firebase.initializeApp({
  apiKey: "REPLACE_WITH_ACTUAL_API_KEY",
  projectId: "REPLACE_WITH_ACTUAL_PROJECT_ID",
  messagingSenderId: "REPLACE_WITH_ACTUAL_SENDER_ID",
  appId: "REPLACE_WITH_ACTUAL_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Adjust as needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
