var admin = require("firebase-admin");

var serviceAccount = require("./graincontrolServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://graincontrol-8b600.firebaseio.com"
});

console.log(admin.database().ref('/average/').set(48.5));