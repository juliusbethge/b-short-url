
const admin = require('firebase-admin');
admin.initializeApp();

const openLink = require("./openLink");
const addLink = require("./addLink");

exports.openLink = openLink.openLink;
exports.addLink = addLink.addLink;