const KNoTCloud = require('knot-cloud');
const cloud = new KNoTCloud(
    '10.77.35.43',
    3000,
    'ac424a73-3508-4ca7-a067-8ea92e510000',
    'f32f559942c54ef95e04c8236ddc0f9adccad6bb',
);

const temp = e => parseFloat((e.data.value / 100).toFixed(1))
const sensor1 = e => e.data.sensor_id == 1
const sensor2 = e => e.data.sensor_id == 2

function manipulateTempTest(array) {
    let arrayTemp1 = array.filter(sensor1).map(temp)
    let arrayTemp2 = array.filter(sensor2).map(temp)

    let thingSensors = [
        { temp: arrayTemp1 },
        { temp: arrayTemp2 }
    ]

    let arrLastValue = []

    for (let i = 0; i < thingSensors.length; i++) {
        const tempValue = thingSensors[i];
        for (let j = 0; j < tempValue.temp.length; j++) {
            let temp = tempValue.temp[j]
        }
        arrLastValue.push(tempValue.temp[tempValue.temp.length - 1])
    }
    console.log(arrLastValue)
    let avg = arrLastValue.reduce((acc, cur) => acc + cur, 0) / arrLastValue.length
    console.log(avg.toFixed(1))

    // console.log(arrayTemp1)
    // console.log(arrayTemp2)
}

async function main() {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);
        //while (true) {
        await cloud.setData('3f3000e1595126ec', [{ sensorId: 5, value: 33 }]);
        let array = await cloud.getData('3f3000e1595126ec');

        //manipulateTempTest(array)

        //}
    } catch (err) {
        console.error(err);
    }

    await cloud.close();
}
main();

