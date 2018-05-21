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

const words = require('../data/words.dict.js');
const phrases = require('../data/phrases.dict.js');
const phrasesMap = require('../data/phrases.dict.map.js');

const parseNumTone = require('./parseNumTone');
const clearTone = require('./clearTone');

function pinyin(hans, options) {

  if (typeof hans !== 'string') {
    throw new Error('入参类型应该为string');
  }
  const config = Object.assign({}, DEFAULT_OPTIONS, options);

  let result = '';
  for (let i = 0; i < hans.length;) {

    // 当前汉字的code
    const code = hans[i].charCodeAt(0) - BASE_CODE;

    // 如果不是汉字，则做相应处理
    if (!words[code]) {
      if (!config.only_chinese) {
        result += hans[i];
      }
      i++;
      continue;
    }

    const p = searchPhrase(code, i, hans);
    let pin = p[0];
    if (config.style === PINYIN_STYLE.NORMAL) {
      pin = clearNum(pin);
    } else if (config.style === PINYIN_STYLE.TONE) {
      pin = pin.split(' ').map((item) => parseNumTone(item)).join(' ');
    } else if (config.style === PINYIN_STYLE.FIRST_LETTER) {
      pin = getFirstLetter(pin);
    }
    result += ' ' + pin;
    i += p[1];
  }
  return result.trim();
}

// 针对每个字搜索词语字典
// 当前汉字可能是一个多音词的第一个字，据此去索引多音词的可能长度
function searchPhrase(code, index, hans) {
  const indexes = phrasesMap[code];

  if (!indexes) return [words[code].split(',')[0], 1];
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

  return [words[code].split(',')[0], 1];
}

// 将拼音后的数字去除
function clearNum(tone) {
  return tone.replace(/\d/g, '');
}

// 获取拼音首字母
function getFirstLetter(word) {
  let result = word[0];
  for (let i = 1; i < word.length; i++) {
    if(word[i] === ' ') {
      result += ' ' + word[i + 1];
    }
  }

  return result;
}

pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
pinyin.STYLE_TONE_NUM = PINYIN_STYLE.TONE_NUM;
pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;

module.exports = pinyin;
