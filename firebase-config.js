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
// These wrappers handle the compat API where admin.js passes db as first arg
window.TN19Firebase = {
    db,
    auth,
    // collection(db, 'name') -> firestore.collection('name')
    collection: function (dbOrPath, path) {
        var colPath = path || dbOrPath;
        return firebase.firestore().collection(colPath);
    },
    addDoc: function (ref, data) { return ref.add(data); },
    getDocs: function (q) { return q.get(); },
    // doc(db, 'collection', 'id') -> firestore.doc('collection/id')
    doc: function (dbOrPath, collectionPath, docId) {
        if (docId) return firebase.firestore().doc(collectionPath + '/' + docId);
        if (collectionPath) return firebase.firestore().doc(dbOrPath + '/' + collectionPath);
        return firebase.firestore().doc(dbOrPath);
    },
    updateDoc: function (ref, data) { return ref.update(data); },
    deleteDoc: function (ref) { return ref.delete(); },
    query: function () { return firebase.firestore().query.apply(firebase.firestore(), arguments); },
    orderBy: function () { return firebase.firestore().orderBy.apply(firebase.firestore(), arguments); },
    onSnapshot: function (q, callback) { return q.onSnapshot(callback); },
    serverTimestamp: function () { return firebase.firestore.FieldValue.serverTimestamp(); },
    signInWithEmailAndPassword: function (authInstance, email, password) {
        return authInstance.signInWithEmailAndPassword(email, password);
    },
    signOut: function (authInstance) { return authInstance.signOut(); },
    onAuthStateChanged: function (authInstance, callback) {
        return authInstance.onAuthStateChanged(callback);
    }
};