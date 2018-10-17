const KNoTCloud = require('knot-cloud');

const cloud = new KNoTCloud(
    '10.77.35.43',
    3000,
    'e75f89e9-c367-4bb3-9210-12ab2cb20000',
    '06b47f5eeb63592ae6124586e6d4e39fb3d7dc07',
);

var admin = require("firebase-admin");
var serviceAccount = require("./graincontrolServiceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://graincontrol-8b600.firebaseio.com"
});

const temp = e => parseFloat((e.data.value / 100).toFixed(1))
const sensor1 = e => e.data.sensor_id == 1
const sensor2 = e => e.data.sensor_id == 2

async function main() {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);
        //let round = 0
        while (true) {

            //await cloud.setData('1a2712e354b27fff', [{ sensorId: 5, value: 27 }]);
            let array = await cloud.getData('6ec06d873f897fd8');

            let arrayTemp1 = array.filter(sensor1).map(temp)
            let arrayTemp2 = array.filter(sensor2).map(temp)

            let thingSensors = [
                { temp: arrayTemp1 },
                { temp: arrayTemp2 }
            ]

            let arrLastValue = []

            for (let i = 0; i < thingSensors.length; i++) {
                const tempValue = thingSensors[i];
                if (tempValue.temp != []) {
                    for (let j = 0; j < tempValue.temp.length; j++) {
                        //console.log(tempValue.temp)
                        let temp = tempValue.temp[j]
                        if (j == 0)
                            admin.database().ref('/temperaturaSensor' + i + '/' + j).set({ graus: temp });
                        else if (temp != tempValue.temp[j - 1]) {
                            admin.database().ref('/temperaturaSensor' + i + '/' + j).set({ graus: temp });
                        }

                    }
                }
                arrLastValue.push(tempValue.temp[tempValue.temp.length - 1])
            }
            //console.log(arrLastValue)
            let avg = arrLastValue.reduce((acc, cur) => acc + cur, 0) / arrLastValue.length
            //console.log(avg.toFixed(1))
            admin.database().ref('/average/').set(parseFloat(avg.toFixed(1)));

            const ref = admin.database().ref('setpoint/valor')//.on("value", s => console.log(s.val()))
            ref.on("value", function (snapshot) {

                console.log(snapshot.val())

                //console.log(auxArr.length + "Nada")
                //if ((auxArr.length >= 2 && auxArr[auxArr.length - 1] != auxArr[auxArr.length - 2]) || (auxArr == [])) {
                console.log("Entrou")
                async function setpoint() {
                    try {
                        const devices = await cloud.getDevices();
                        await cloud.setData('6ec06d873f897fd8', [{ sensorId: 5, value: snapshot.val() }]);
                        console.log(devices);
                    } catch (err) {
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
        }
    } catch (err) {
        console.error(err);
    }

    await cloud.close();
}
main();
