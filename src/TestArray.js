var moment = require('moment');

const arr = [{
    data: { sensor_id: 2, value: 25 },
    timestamp: '2018-08-25T05:29:43.519Z'
},
{
    data: { sensor_id: 1, value: 27 },
    timestamp: '2018-08-25T05:29:43.520Z'
}]

const time = e => e.timestamp = moment().format("DD/MM/YYYY HH:mm");

let arrTemp = arr.map(e => e.data.value);
let arrTime = arr.filter(time).map(e => e.timestamp);

let obj = []
for (let i = 0; i < arrTemp.length; i++) {
    obj.push({temp: arrTemp[i], time: arrTime[i]})
}

console.log(obj)