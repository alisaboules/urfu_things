importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAUISeON5hziPjVSuF9wQi5PIKxExx6XR8",
  authDomain: "unifind-2c6c6.firebaseapp.com",
  projectId: "unifind-2c6c6",
  storageBucket: "unifind-2c6c6.firebasestorage.app",
  messagingSenderId: "293333471572",
  appId: "1:293333471572:web:29d06ad2866c1abaa378c1",
  measurementId: "G-G7SE46BP3L"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});