const symbolDict = require('./phonetic-symbol').tone;
const p = new RegExp('([' + Object.keys(symbolDict).join('') + '])', 'g');

function parseToneNum(word) {
  let s = '';
  let r = word.replace(p, (i) => {
    s = symbolDict[i][1];
    return symbolDict[i][0];
  });

  return r + s;
}

module.exports = parseToneNum;
