var admin = require("firebase-admin");

var serviceAccount = require("./graincontrolServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://graincontrol-8b600.firebaseio.com"
});

const KNoTCloud = require('knot-cloud');

const cloud = new KNoTCloud(
    '10.77.35.43',
    3000,
    'e75f89e9-c367-4bb3-9210-12ab2cb20000',
    '06b47f5eeb63592ae6124586e6d4e39fb3d7dc07',
);

//console.log(admin.database().ref('/average/').set(17.5));
const refOnOff = admin.database().ref('/on_off/')
refOnOff.on('value', s => console.log(s.val()))