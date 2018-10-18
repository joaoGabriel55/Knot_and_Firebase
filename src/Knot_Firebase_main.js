const KNoTCloud = require('knot-cloud');
const admin = require("firebase-admin");
const serviceAccount = require("./graincontrolServiceAccount.json");

const cloud = new KNoTCloud(
    '10.77.35.43',
    3000,
    'ac424a73-3508-4ca7-a067-8ea92e510000',
    'f32f559942c54ef95e04c8236ddc0f9adccad6bb',
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://graincontrol-8b600.firebaseio.com"
});

let arrayCompare = [];

const ID = '3f3000e1595126ec'

const temp = e => parseFloat((e.data.value / 100).toFixed(1))

async function setpoint(val) {
    try {
        //const devices = await cloud.getDevices();
        await cloud.setData(ID, [{ sensorId: 5, value: val }]);
        //console.log(devices);
    } catch (err) {
        console.error(err);
    }
}

async function main() {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);

        while (true) {

            let array = await cloud.getData(ID);

            let arrayTempAvg = array.map(temp)

            let lastAvgValue = 0;

            if (arrayTempAvg != []) {
                for (let i = 0; i < arrayTempAvg.length; i++) {
                    const tempValue = arrayTempAvg[i];

                    //console.log(tempValue.temp)
                    if (i == 0)
                        admin.database().ref('/temperaturaSensorAvg/' + i).set(tempValue);
                    else if (tempValue != arrayTempAvg[i - 1])
                        admin.database().ref('/temperaturaSensorAvg/' + i).set(tempValue);

                }
                lastAvgValue = arrayTempAvg[arrayTempAvg.length - 1];
                admin.database().ref('/average/').set(lastAvgValue);
            }

            const ref = admin.database().ref('setpoint/valor')//.on("value", s => console.log(s.val()))
            ref.on("value", function (snapshot) {

                console.log("Entrou")

                setpoint(snapshot.val());

            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
    } catch (err) {
        console.error(err);
    }

    await cloud.close();
}
main();
