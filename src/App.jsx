if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker تم تسجيله بنجاح:', registration.scope);
    })
    .catch((err) => {
      console.log('فشل تسجيل Service Worker:', err);
    });
}
