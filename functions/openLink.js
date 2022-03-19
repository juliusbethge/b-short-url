const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.openLink = functions.region('europe-west1').https.onRequest(async (request, response) => {

    const shortHash = request.originalUrl.substring(1);

    const documentSnapshot = await db.collection("links").doc(shortHash).get();

    let urlToRedirect = process.env.DEFAULT_WEBSITE_URL;

    if (documentSnapshot.exists && documentSnapshot.data().longUrl !== undefined) {
        urlToRedirect = documentSnapshot.data().longUrl;
    }

    response.redirect(urlToRedirect);
});