// 将words.js中的带音调转换为words.dict.js中的数字表示
const fs = require('fs');

const fWrite = fs.createWriteStream('./words.dict.js');

const wordsDict = require('./words');
const symbolDict = require('./phonetic-symbol');
const final = {};
const p = new RegExp("([" + Object.keys(symbolDict).join("") + "])", "g");
for (const key in wordsDict) {
  let value = wordsDict[key];
  const arr = value.split(',').map((item) => {
    let s = '';
    let r = item.replace(p, (i) => {
      s = symbolDict[i][1];
      return symbolDict[i][0]
    });

    r += s;
    return r;
  });

  final[key] = arr.join(',');
}

final['呣'] = 'm4';

fWrite.write('module.exports='+JSON.stringify(final));
