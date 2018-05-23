const PINYIN_STYLE = {
  NORMAL: 0,          // 不带声调输出
  TONE: 1,            // 标注声调
  TONE_NUM: 2,        // 数字形式的声调，0-5表示五种类型
  FIRST_LETTER: 3     // 返回首字母
};

const DEFAULT_OPTIONS = {
  // 过滤掉汉字之外的内容
  only_chinese: false
};

const BASE_CODE = 19968;

// 解析字典，将字符串在导入时解析成对象
const wordsStr = require('../data/words.dict.js');

const words = {};
wordsStr.split(',').forEach((item, index) => {
  words[index] = item;
});
// 繁体字字典
const tradition = require('../data/tradition.dict.js');
// 多音词的字典
const phrases = require('../data/phrases.dict.js');
// 映射多音词长度的字典，辅助搜索算法
const phrasesMap = require('../data/phrases.dict.map.js');

// 将数字声调转成字符
const parseNumTone = require('./parseNumTone');

function pinyin(hans, options) {

  if (typeof hans !== 'string') {
    throw new Error('入参类型应该为string');
  }
  const config = Object.assign({}, DEFAULT_OPTIONS, options);

  hans = convertTrandition(hans);
  let result = [];
  let nohan = '';

  for (let i = 0; i < hans.length;) {


    // 当前汉字的code
    const code = hans[i].charCodeAt(0) - BASE_CODE;

    // 如果不是汉字，则做相应处理
    if (!words[code]) {
      if (!config.only_chinese) {
        nohan += hans[i];
      }
      i++;
      continue;
    } else if (nohan !== ''){
      result.push(nohan);
      nohan = '';
    }

    const p = searchPhrase(code, i, hans);
    let pin = p[0];
    if (config.style === PINYIN_STYLE.NORMAL) {
      pin = clearNum(pin).split(' ');
    } else if (config.style === PINYIN_STYLE.TONE) {
      pin = pin.split(' ').map((item) => parseNumTone(item));
    } else if (config.style === PINYIN_STYLE.FIRST_LETTER) {
      pin = getFirstLetter(pin);
    } else {
      pin = pin.split(' ');
    }
    result = result.concat(pin);
    i += p[1];
  }
  if(nohan !== ''){
    result.push(nohan);
    nohan = '';
  }
  return result;
}

// 将文字中的繁体转换为简体
function convertTrandition(hans) {
  let newHans = '';
  for (let i = 0; i < hans.length; i++) {
    newHans += tradition[hans[i]] || hans[i];
  }
  return newHans;
}

// 针对每个字搜索词语字典
// 当前汉字可能是一个多音词的第一个字，据此去索引多音词的可能长度
function searchPhrase(code, index, hans) {
  const indexes = phrasesMap[code];

  if (!indexes) return [words[code].split(' ')[0], 1];
  // 汉字总长度
  const len = hans.length;
  // 词典中的候选词长度
  let phraseLen = 1;
  // 从最大的长度开始匹配
  for (let j = indexes.length - 1; j >= 0; j--) {
    phraseLen = Number(indexes[j]);
    if (phraseLen > len - index) continue;
    const key = hans.substr(index, indexes[j]);

    if (phrases[key]) return [phrases[key], phraseLen];
  }
  return [words[code].split(' ')[0], 1];
}

// 将拼音后的数字去除
function clearNum(tone) {
  return tone.replace(/\d/g, '');
}

// 获取拼音首字母
function getFirstLetter(word) {
  let result = [word[0]];
  for (let i = 1; i < word.length; i++) {
    if(word[i] === ' ') {
      result.push(word[i + 1]);
    }
  }

  return result;
}

pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
pinyin.STYLE_TONE_NUM = PINYIN_STYLE.TONE_NUM;
pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;

module.exports = pinyin;
