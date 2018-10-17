let thingSensors = [
    { temp: [1, 2, 25] },
    { temp: [4, 5, 48] }
]

let arrLastValue = []

for (let i = 0; i < thingSensors.length; i++) {
    const tempValue = thingSensors[i];
    for (let j = 0; j < tempValue.temp.length; j++) {
        //const element = tempValue.temp[j];
        console.log(tempValue.temp)
        
    }
    arrLastValue.push(tempValue.temp[tempValue.temp.length - 1])
}
console.log(arrLastValue)
let avg = arrLastValue.reduce((acc, cur) => acc + cur, 0) / arrLastValue.length
console.log(parseFloat(avg))