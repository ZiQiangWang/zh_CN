// 将words.js中的带音调转换为words.dict.js中的数字表示
const fs = require('fs');

const fWrite = fs.createWriteStream('../data/words.dict.js');

const wordsDict = require('../data/words');


const parseToneNum = require('../src/parseToneNum');
// 汉字取值范围为19968-40896
const startCode = 19968;

const final = [];

for (const key in wordsDict) {
  final[key.charCodeAt(0) - startCode] = wordsDict[key].split(',').map((item) => parseToneNum(item)).join(' ');
}

fWrite.write('module.exports="' + final.join(',') + '"');
