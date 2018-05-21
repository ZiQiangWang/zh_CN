const pinyin = require('../src/index');

const cases = [
  ['单音字', '我', {
    STYLE_NORMAL: 'wo',
    STYLE_TONE: 'wǒ',
    STYLE_TONE_NUM: 'wo3',
    STYLE_FIRST_LETTER: 'w'
  }],
  ['多音词', '重庆', {
    STYLE_NORMAL: 'chong qing',
    STYLE_TONE: 'chóng qìng',
    STYLE_TONE_NUM: 'chong2 qing4',
    STYLE_FIRST_LETTER: 'c q'
  }],
  ['多音词', '中国', {
    STYLE_NORMAL: 'zhong guo',
    STYLE_TONE: 'zhōng guó',
    STYLE_TONE_NUM: 'zhong1 guo2',
    STYLE_FIRST_LETTER: 'z g'
  }],
];

function createTest(desc, words, styles) {
  describe(desc, () => {
    Object.keys(styles).forEach((item, index) => {
      test(String.fromCharCode(97 + index) + '.' + item, () => {
        expect(pinyin(words, {style: pinyin[item]})).toBe(styles[item]);
      });
    });
  });
}

describe('pinyin的测试用例', () => {
  cases.forEach((item, index) => {
    createTest(index + 1 + '.' + item[0], item[1], item[2]);
  });
});
