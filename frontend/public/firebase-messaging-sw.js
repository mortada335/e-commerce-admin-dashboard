/* eslint-disable no-undef */
// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
)

const firebaseConfig = {
  apiKey: "AIzaSyChC36di2PtTZPiigA7HBXSXW9u-dpi9OY",
  authDomain: "taawon-e-commerce.firebaseapp.com",
  projectId: "taawon-e-commerce",
  storageBucket: "taawon-e-commerce.firebasestorage.app",
  messagingSenderId: "53248714488",
  appId: "1:53248714488:web:4793c95895e27a5c717d0d",
  measurementId: "G-DMCW708W2V"
}
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// }

firebase.initializeApp(firebaseConfig)
firebase.messaging()

// // messaging.onBackgroundMessage((payload) => {
// //   const notificationTitle = payload.notification.title
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     icon: "/firebase-logo.png",
// //   }

// //   self.registration.showNotification(notificationTitle, notificationOptions)
// // })
