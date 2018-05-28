// 将解析cc-credict解析为phrases.dict.js中的对象
const readline = require('readline');
const fs = require('fs');

const phrases = fs.createReadStream('../data/cc-cedict/cedict_ts.u8');
const phrasesDict = fs.createWriteStream('../data/phrases_test.dict.js');

const words = require('../data/words.dict.js');

const pinyinDict = {};
words.split(',').forEach((item, index) => {
  pinyinDict[index] = item;
});

const rl = readline.createInterface({
  input: phrases
});

const startCode = 19968;
const regex = /(.*?) (.*?) \[(.*?)\]/i;

const final = {};

rl.on('line', (line) => {
  line = line.replace(/u:/g, 'v').toLowerCase();
  const result = line.match(regex);

  if (result) {
    const key = result[2];
    const value = result[3];
    if (key.length < 2) {
      return;
    }
    filterNoChiese(key) && (final[key] = value);
  };
});
// 过滤掉包含非中文的词
function filterNoChiese(key) {
  for (let i = 0; i < key.length; i++) {
    const l = pinyinDict[key.charCodeAt(i) - startCode ];
    if(!l) {
      return false;
    }
  }
  return true;
}

rl.on('close', () => {
	phrasesDict.write('module.exports=' + JSON.stringify(final));
});
