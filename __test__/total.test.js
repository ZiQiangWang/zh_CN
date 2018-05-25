const pinyin = require('../src/index');
const testDict = require('../data/phrases_test.dict.js');


describe('使用cc-cedict生成的字典测试', () => {
  Object.keys(testDict).forEach((word) => {
    test(word, () => {
      expect(pinyin(word, {style: pinyin.STYLE_TONE_NUM})).toEqual(testDict[word].replace(/,/g,'，').split(' '));
    });
  });
});
