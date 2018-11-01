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

async function main() {
    try {
        await cloud.connect();
        const devices = await cloud.getDevices();
        console.log(devices);
        //while (true) {
        await cloud.setData('2fbd47b25fb46875', [{ sensorId: 6, value: 35 }]);
        let array = await cloud.getData('2fbd47b25fb46875');

        //manipulateTempTest(array)
        console.log(array);
        //}
    } catch (err) {
        console.error(err);
    }

    await cloud.close();
}
main();

