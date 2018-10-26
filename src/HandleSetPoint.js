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
    'ac424a73-3508-4ca7-a067-8ea92e510000',
    'f32f559942c54ef95e04c8236ddc0f9adccad6bb',
);

const ID = '292b31b67ec658ea'

async function main(val) {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);
        ///while (true) {

        await cloud.setData(ID, [{ sensorId: 6, value: val }]);

        //}
    } catch (err) {
        console.error(err);
    }
    await cloud.close();

}
const ref = admin.database().ref('setpoint/valor')//.on("value", s => console.log(s.val()))
ref.on("value", function (snapshot) {

    console.log(snapshot.val())

    main(snapshot.val());

}, function (error) {
    console.log("Error: " + error.code);
});