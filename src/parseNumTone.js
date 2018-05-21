const PHONETIC_SYMBOL = require('./phonetic-symbol').num;
const pWord = /[aoeiuv]+/;

const parseNumTone = function(word) {
  if (typeof word !== 'string') return word;
  if (word.length === 0) return '';

  const tone = word.charAt(word.length - 1);
  if (isNaN(+tone)) return word;

  word = word.slice(0, -1);
  if (tone === '5') return word;
  if(word === 'm') return PHONETIC_SYMBOL[word + tone];

  // 拼音中元音韵母部分
  const vowel = pWord.exec(word)[0];
  if (vowel.length === 1) {
    word = word.replace(vowel, PHONETIC_SYMBOL[vowel + tone]);
  } else if (vowel.includes('a')){
    word = word.replace('a', PHONETIC_SYMBOL['a' + tone]);
  } else if (vowel.includes('e')) {
    word = word.replace('e', PHONETIC_SYMBOL['e' + tone]);
  } else if (vowel.includes('o')) {
    word = word.replace('o', PHONETIC_SYMBOL['o' + tone]);
  } else {
    const key = vowel.charAt(vowel.length - 1);
    word = word.replace(key, PHONETIC_SYMBOL[key + tone]);
  }

  return word;
};

module.exports = parseNumTone;
