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
const ref = admin.database().ref('setpoint/valor')//.on("value", s => console.log(s.val()))
ref.on("value", function (snapshot) {

  console.log(snapshot.val())

  //console.log(auxArr.length + "Nada")
  //if ((auxArr.length >= 2 && auxArr[auxArr.length - 1] != auxArr[auxArr.length - 2]) || (auxArr == [])) {
      console.log("Entrou")
      async function setpoint(){
          try {
              await cloud.connect();
              const devices = await cloud.getDevices();
              await cloud.setData('6ec06d873f897fd8', [{ sensorId: 5, value: snapshot.val() }]);
              console.log(devices);
          }catch (err) {
              console.error(err);
          }
      }
      setpoint();
    
      
  // } else if (auxArr.length > 100 && auxArr[auxArr.length - 1] == auxArr[auxArr.length - 2]) {
  //     auxArr = [];
  // }
  

}, function (error) {
  console.log("Error: " + error.code);
});

