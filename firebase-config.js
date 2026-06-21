// ============================================
// TN19 MOBILES - FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCmmJcWm8hcu9SfsIt0jmoQls9xgs-ZId8",
    authDomain: "tn19mobiles-6f1de.firebaseapp.com",
    projectId: "tn19mobiles-6f1de",
    storageBucket: "tn19mobiles-6f1de.firebasestorage.app",
    messagingSenderId: "310518748672",
    appId: "1:310518748672:web:018ed83bb4fa9711b3aae5",
    measurementId: "G-2QZDCDYS3B"
};

// Initialize Firebase using the global Firebase objects from CDN scripts
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other scripts
window.TN19Firebase = {
    db,
    auth,
    collection: (...args) => firebase.firestore().collection(...args),
    addDoc: (ref, data) => ref.add(data),
    getDocs: (q) => q.get(),
    doc: (...args) => firebase.firestore().doc(...args),
    updateDoc: (ref, data) => ref.update(data),
    deleteDoc: (ref) => ref.delete(),
    query: (...args) => firebase.firestore().query(...args),
    orderBy: (...args) => firebase.firestore().orderBy(...args),
    onSnapshot: (q, callback) => q.onSnapshot(callback),
    serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp(),
    signInWithEmailAndPassword: (auth, email, password) => auth.signInWithEmailAndPassword(email, password),
    signOut: (auth) => auth.signOut(),
    onAuthStateChanged: (auth, callback) => auth.onAuthStateChanged(callback)
};