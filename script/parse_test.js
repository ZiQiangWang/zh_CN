// 将解析cc-credict解析为phrases.dict.js中的对象
const readline = require('readline');
const fs = require('fs');

const phrases = fs.createReadStream('../data/cc-cedict/cedict_ts.u8');
const phrasesDict = fs.createWriteStream('../data/phrases_test.dict.js');

const rl = readline.createInterface({
  input: phrases
});

const regex = /(.*?) (.*?) \[(.*?)\]/i;

const final = {};

rl.on('line', (line) => {
  line = line.replace('u:', 'v').toLowerCase();
  const result = line.match(regex);

  if (result) {
    const key = result[2];
    const value = result[3];
    if (key.length < 3) {
      return;
    }
    const ran = Math.random() * 100;
    if (ran <=5 ) {
      final[key] = value;
    }
  };
});

rl.on('close', () => {
	phrasesDict.write('module.exports=' + JSON.stringify(final));
});
