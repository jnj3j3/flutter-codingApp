"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const adminAndroid = require('firebase-admin');
let androidServiceAccount = require('../config/firebase-adminsdk.json');
exports.admin = adminAndroid.initializeApp({
    credential: adminAndroid.credential.cert(androidServiceAccount)
});
//# sourceMappingURL=FCMadmin.js.map