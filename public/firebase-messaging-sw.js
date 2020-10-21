importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");
if (!firebase.apps.length) {
firebase.initializeApp({
  apiKey: "AIzaSyDsKYfDD9snfFnrCOG2CKp8xClVb_5Ay7E",
  authDomain: "dsc-aura.firebaseapp.com",
  databaseURL: "https://dsc-aura.firebaseio.com",
  projectId: "dsc-aura",
  storageBucket: "dsc-aura.appspot.com",
  messagingSenderId: "904550820845",
  appId: "1:904550820845:web:dc711ef8eb1dbca41595e4"
});

var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Handling background message ', payload);

    return self.registration.showNotification(payload.data.title, {
      actions: [
        {
          action: "open",
          title: "Visit Site"
        }
      ]
    });
  });

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(self.clients.openWindow(event.notification.data));
  });
}