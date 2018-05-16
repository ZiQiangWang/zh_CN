const readline = require('readline');
const fs = require('fs');
const os = require('os');

const pinyinDict = require('./pinyin.dict.js');

const dictSrc = './cc-cedict/cedict_ts.u8';
const dict = './dict.js';

const fRead = fs.createReadStream(dictSrc);
const fWrite = fs.createWriteStream(dict);

const rl = readline.createInterface({
  input: fRead
});

// 去掉词语后面的注释
const pExplain = /\/.*\//;

const pMain = /\[.*\]/;

// 匹配每个音标
const pWord = /([a-zA-Z]+\:?)(\d)$/;


const final = {};

rl.on('line', (line) => {
	let result = line.replace(pExplain, '').trim();
    result = result.replace(/[\[\]]/g, '').split(' ');
    const key = result[1];
    let isMult = false;
    for (let i = 0; i < key.length; i++) {
      const l = pinyinDict[key.charAt(i)];
      if(l && l.split(',').length > 1) {
        isMult = true;
      }
    }
    isMult && (final[key] = result.slice(2).join(',').replace('u:', 'v'));
});

rl.on('close', ()=>{
	fWrite.write('module.exports='+JSON.stringify(final));
});
