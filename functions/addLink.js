const functions = require('firebase-functions');

const admin = require('firebase-admin');
const db = admin.firestore();

const crypto = require('crypto');

exports.addLink = functions.region('europe-west1').https.onCall(async (data, context) => {

    const longUrl = data.longUrl;
    const shortHash = crypto.createHash('md5').update(longUrl).digest('base64').slice(0, process.env.LENGTH_OF_SHORT_URL);
    const shortUrl = process.env.DEFAULT_WEBSITE_URL + "/" + shortHash;

    db.collection('links').doc(shortHash).set({
        longUrl,
        shortUrl
    });

    return shortUrl;
});