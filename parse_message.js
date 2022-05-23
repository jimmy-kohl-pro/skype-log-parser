const fs = require('fs');
const readline = require('readline');

const filename = process.argv[2];


const data = fs.readFileSync(filename);
const jsonData = JSON.parse(data);


for ([key, value] of Object.entries(jsonData)) {
    console.log(key);
}

console.log('////')

for ([key, value] of Object.entries(jsonData.conversations[0])) {
    console.log(key);
}