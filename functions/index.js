
const admin = require('firebase-admin');
admin.initializeApp();

const openLink = require("./openLink");

exports.openLink = openLink.openLink;