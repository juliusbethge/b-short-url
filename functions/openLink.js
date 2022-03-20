const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.openLink = functions.region('europe-west1').https.onRequest(async (request, response) => {

    const shortHash = request.originalUrl.substring(1);

    const documentSnapshot = await db.collection("links").doc(shortHash).get();

    let urlToRedirect = "https://www." + process.env.DEFAULT_WEBSITE_URL;

    if (documentSnapshot.exists && documentSnapshot.data().longUrl !== undefined) {
        urlToRedirect = documentSnapshot.data().longUrl;
    }

    db.collection("links").doc(shortHash).update({
        visitCount: FieldValue.increment(1),
        lastVisited: FieldValue.serverTimestamp()
    })

    response.redirect(urlToRedirect);
});