const functions = require('firebase-functions');

const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const db = admin.firestore();

const crypto = require('crypto');

exports.addLink = functions.region('europe-west1').https.onCall(async (data, context) => {

    const longUrl = data.longUrl;
    const shortHash = crypto.createHash('md5').update(longUrl).digest('base64').slice(0, process.env.LENGTH_OF_SHORT_URL);
    const shortUrl = process.env.DEFAULT_WEBSITE_URL_SHORT + "/" + shortHash;

    const documentSnapshot = await db.collection("links").doc(shortHash).get();

    if (documentSnapshot.exists) {
        return {
            success: false,
            errorMessage: "this short url already exists! please try another one"
        }
    }

    await db.collection('links').doc(shortHash).set({
        longUrl,
        shortUrl,
        visitCount: 0,
        lastVisited: FieldValue.serverTimestamp()
    });

    return {
        success: true,
        shortUrl
    };
});