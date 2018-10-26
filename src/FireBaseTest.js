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

console.log(admin.database().ref('/temperaturaSensorAvg/').update({"3": 25.5}));
//const refOnOff = admin.database().ref('/average/')
//refOnOff.on('value', s => console.log(s.val()))
// let count = 0;
// let rand = (Math.random() * (20.5 - 40.5) + 40.5).toFixed(1);
// console.log(rand)

// for (let index = 0; index < 1000; index++) {
//   let rand = (Math.random() * (20.5 - 40.5) + 40.5).toFixed(1);
//   if (count >= 9)
//     count = 0

//   console.log(admin.database().ref('/temperaturaSensorAvg/' + count).set(parseFloat(rand)));
//   count++;
// }