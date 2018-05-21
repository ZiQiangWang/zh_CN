const symbolDict = require('./phonetic-symbol').tone;
const p = new RegExp('([' + Object.keys(symbolDict).join('') + '])', 'g');

function clearTone(word) {
  return word.replace(p, (i) => {
    return symbolDict[i][0];
  });
}

module.exports = clearTone;
