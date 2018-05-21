// 将解析cc-credict解析为phrases.dict.js中的对象
const readline = require('readline');
const fs = require('fs');

const pinyinDict = require('./words.dict.js');
const phrases = fs.createReadStream('./cc-cedict/cedict_ts.u8');
const phrasesDict = fs.createWriteStream('./phrases.dict.js');
const phraseMap = fs.createWriteStream('./phrases.dict.map.js');

const rl = readline.createInterface({
  input: phrases
});

const startCode = 19968;
const regex = /(.*?) (.*?) \[(.*?)\]/i;

const final = {};
// 保存长度为2和3的字典，用来字段的截取和去重
const repeat = {};

rl.on('line', (line) => {
  line = line.replace('u:', 'v').toLowerCase();
  const result = line.match(regex);
  if (result) {

    const key = result[2];

    if (key.length === 1) {
      return;
    }
    const value = result[3];

    if (key.length === 2 || key.length === 3) {
      repeat[key] = value;
    }
    splitLong(key, value, '，') &&
    splitLong(key, value, '·') &&
    checkMulti(key, value) && (final[key] = value);
  };
});

// 有些单词是组合词，如果在现有的词典中已经已经存在，可以将重复的部分删除
// 例如北京在字典中已存在，北京话就可以从字典中去掉
function removeRepeat(key, value) {
  const length = key.length;
  if (length < 3) return;

  const start2 = key.substring(0, 2);
  const start3 = key.substring(0, 3);
  const end2 = key.substring(length - 2);
  const end3 = key.substring(length - 3);
  if (length === 3) {
    if (repeat[start2]) {
      replaceMulti(key, value, 2, length);
    } else if (repeat[end2]) {
      replaceMulti(key, value, 0, length - 2);
    }
  } else {
    if (repeat[start3]) {
      replaceMulti(key, value, 3, length);
    } else if (repeat[end3]) {
      replaceMulti(key, value, 0, length - 3);
    } else if (repeat[start2]) {
      replaceMulti(key, value, 2, length);
    } else if (repeat[end2]) {
      replaceMulti(key, value, 0, length - 2);
    }
  }
}

// 替换多音字
function replaceMulti(key, value, start, end) {
  if (!final[key]) return;

  const remain = key.substring(start, end);
  value = final[key].split(' ').slice(start, end).join(' ');
  const isMult = checkMulti(remain, value);
  if (!isMult) {
    delete final[key];
  } else {
    if (remain.length > 1) {
      if (final[key]) {
        final[remain] = value;
        removeRepeat(remain, value);
        delete final[key];
      }
    }
  }
}

// 字典中存在使用“，”和”·”分割的词语，没有必要进行这种匹配，所以进行划分
function splitLong(key, value, separator) {
  const dic = {
    '，': ',',
    '·': '·'
  }
  if (key.indexOf(separator) !== -1) {

    key.split(separator).forEach((item, index) => {
      checkMulti(item, value) && (final[item] = value.split(` ${dic[separator]} `)[index]);
    });
    return false;
  }
  return true;
}

// 检测是否包含多音字
function checkMulti(key, value) {
  const vals = value.split(' ');
  for (let i = 0; i < key.length; i++) {
    const l = pinyinDict[key.charCodeAt(i) - startCode ];
    const pinyins = l ? l.split(',') : [];
    // 只保存多音字
    if(pinyins.length > 1 && pinyins.indexOf(vals[i]) > 0) {
      return true;
    }
  }
  return false;
}

function creatPhraseMap(final) {
  const map = {};

  Object.keys(final).forEach((item) => {
    const index = item[0].charCodeAt(0) - startCode;
    const length = final[item].split(' ').length;

    if (map[index]) {
      map[index].push(length);
    } else {
      map[index] = [length];
    }
  });

  Object.keys(map).forEach((item) => {
    map[item] = Array.from(new Set(map[item])).sort().join("");
  });

  return map;
}

rl.on('close', () => {
  // 使用现有字典裁剪长词
  Object.keys(final).forEach((item) => {
    removeRepeat(item, final[item]);
  });

  const map = creatPhraseMap(final);
  phraseMap.write('module.exports=' + JSON.stringify(map));
	phrasesDict.write('module.exports=' + JSON.stringify(final));
});
