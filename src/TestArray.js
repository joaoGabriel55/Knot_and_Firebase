var moment = require('moment');

const arr = [{
    data: { sensor_id: 2, value: 25 },
    timestamp: '2018-08-25T05:29:43.520Z'
},
{
    data: { sensor_id: 1, value: 27 },
    timestamp: '2018-08-25T05:29:43.519Z'
}]

const time = e => e.timestamp = moment().format("HH:mm");

//let arrTemp = arr.map(e => e.data.value);
//let arrTime = arr.filter(time).map(e => e.timestamp);

let obj = []
for (let i = 0; i < arr.length; i++) {
    obj.push({ temp: arr[i].data.value, time: arr[i].timestamp })
}

let newHihi = obj.sort(function (a, b) {
    if (a.time > b.time)
        return 1
    if (a.time < b.time)
        return -1;

    // a must be equal to b
    return 0;
})


console.log(newHihi)

// function sleep(time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
// }

// sleep(5000).then(()=>{
//     console.log(obj[obj.length - 1].temp)
// });

