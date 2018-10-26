const KNoTCloud = require('knot-cloud');
const admin = require("firebase-admin");
const serviceAccount = require("./graincontrolServiceAccount.json");
const moment = require('moment');

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

const ID = '292b31b67ec658ea'

const temp = e => parseFloat((e.data.value / 100).toFixed(1));
const time = e => e.timestamp = moment().format("HH:mm");

async function setpoint(val) {
    try {
        //TODO comparaçao        
        await cloud.setData(ID, [{ sensorId: 6, value: val }]);

    } catch (err) {
        console.error(err);
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);

        while (true) {
            //sleep(5000).then(() => {
                let array = await cloud.getData(ID);

                array.sort(function (a, b) {
                    if (a.timestamp > b.timestamp)
                        return 1
                    if (a.timestamp < b.timestamp)
                        return -1;
                
                    // a must be equal to b
                    return 0;
                })

                let arrayTemp = array.map(temp)
                let arrayTime = array.map(time)

                let arrayTempAvg = arrayTemp
                // for (let i = 0; i < arrayTemp.length; i++) {
                //     arrayTempAvg.push({ temp: arrayTemp[i], time: arrayTime[i] })
                // }
                let arrayGoodValues = []

                let lastAvgValue = 0;

                if (arrayTempAvg != []) {
                    for (let i = 0; i < arrayTempAvg.length; i++) {
                        const tempValue = arrayTempAvg[i];
                        //const timeValue = arrayTempAvg[i].time;

                        //console.log(tempValue.temp)
                        if (i == 0 && tempValue >= 1){
                            admin.database().ref('/temperaturaSensorAvg/' + i).set(tempValue);
                            arrayGoodValues.push(tempValue);
                        } else if ((tempValue != arrayTempAvg[i - 1]) && tempValue >= 1) {
                            admin.database().ref('/temperaturaSensorAvg/' + i).set(tempValue);
                            arrayGoodValues.push(tempValue);

                        }

                    }

                    //console.log(arrayTempAvg[arrayTempAvg.length - 1]);

                    lastAvgValue = arrayGoodValues[arrayGoodValues.length - 1];

                    admin.database().ref('/average/').set(lastAvgValue);
                }

                // const ref = admin.database().ref('setpoint/valor')//.on("value", s => console.log(s.val()))
                // ref.on("value", function (snapshot) {

                //     console.log(snapshot.val())

                //     setpoint(snapshot.val());

                // }, function (error) {
                //     console.log("Error: " + error.code);
                // });
            //})
        }

    } catch (err) {
        console.error(err);
    }

    await cloud.close();
}
main();
