const admin = require('firebase-admin');

require('dotenv').config();

// const credentials = require('./firebase-adminsdk.json');

// admin.initializeApp({ credential: admin.credential.cert(credentials) });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

module.exports = admin;
