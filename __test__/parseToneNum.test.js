const parseToneNum = require('../src/parseToneNum');

const cases = [
  ['单个韵母', {
    'tā': 'ta1',
    'pó': 'po2',
    'lè': 'le4',
    'lǐ': 'li3',
    'lǔ': 'lu3',
    'lǘ': 'lv2'
  }],
  ['包含a', {
    'lǎo': 'lao3',
    'tài': 'tai4',
    'tiān': 'tian1',
    'tuán': 'tuan2',
    'liáng': 'liang2',
    'xiǎo': 'xiao3',
  }],
  ['包含o和e', {
    'tuō':'tuo1',
    'liè':'lie4',
    'léi':'lei2',
    'yuè':'yue4',
    'xióng':'xiong2'
  }],
  ['u和i并列标后面', {
    'liú': 'liu2',
    'ruì': 'rui4'
  }],
];

function createTest(desc, pinyin) {
  describe(desc, () => {
    Object.keys(pinyin).forEach((item) => {
      test(item, () => {
        expect(parseToneNum(item)).toEqual(pinyin[item]);
      });
    });
  });
}

describe('parseToneNum的测试用例', () => {
  cases.forEach((item, index) => {
    createTest(index + 1 + '.' + item[0], item[1]);
  });
});
