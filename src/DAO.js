var admin = require("firebase-admin");
var serviceAccount = require("./graincontrolServiceAccount.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://graincontrol-8b600.firebaseio.com"
// });

const temp = e => parseFloat((e.data.value / 100).toFixed(1))
const sensor1 = e => e.data.sensor_id == 1
const sensor2 = e => e.data.sensor_id == 2

//Serve para amazenar valores anteriores e comparar com atuais
let auxArr = [];

var ref = admin.database().ref('setpoint/valor');

function manipulateSetPoint() {
    ref.on("value", function (snapshot) {

        auxArr.push(snapshot.val())

        //console.log(auxArr.length + "Nada")
        //if ((auxArr.length >= 2 && auxArr[auxArr.length - 1] != auxArr[auxArr.length - 2]) || (auxArr == [])) {
            console.log(auxArr + "Entrou")
            auxArr = [];
            async function setpoint(){
                try {
                    await cloud.connect();
                    const devices = await cloud.getDevices();
                    console.log(devices);
                }catch (err) {
                    console.error(err);
                }
            }

            setpoint();
            console.log(auxArr.length)
            
        // } else if (auxArr.length > 100 && auxArr[auxArr.length - 1] == auxArr[auxArr.length - 2]) {
        //     auxArr = [];
        // }
        

    }, function (error) {
        console.log("Error: " + error.code);
    });
}

async function manipulateTemp(array) {
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
    
    //manipulateSetPoint()
    // console.log(arrayTemp1)
    // console.log(arrayTemp2)
}

module.exports = { manipulateTemp, manipulateSetPoint}