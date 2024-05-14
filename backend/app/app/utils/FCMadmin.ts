const adminAndroid = require('firebase-admin');
let androidServiceAccount = require('../config/firebase-adminsdk.json');
export const admin = adminAndroid.initializeApp({
    credential: adminAndroid.credential.cert(androidServiceAccount)
});