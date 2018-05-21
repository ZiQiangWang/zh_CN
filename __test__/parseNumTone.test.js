const parseNumTone = require('../src/parseNumTone');

const cases = [
  ['单个韵母', {
    'ta1': 'tā',
    'po2': 'pó',
    'le4': 'lè',
    'li3': 'lǐ',
    'lu3': 'lǔ',
    'lv2': 'lǘ'
  }],
  ['包含a', {
    'lao3': 'lǎo',
    'tai4': 'tài',
    'tian1': 'tiān',
    'tuan2': 'tuán',
    'liang2': 'liáng',
    'xiao3': 'xiǎo'
  }],
  ['包含o和e', {
    'tuo1': 'tuō',
    'lie4': 'liè',
    'lei2': 'léi',
    'yue4': 'yuè',
    'xiong2': 'xióng'
  }],
  ['u和i并列标后面', {
    'liu2': 'liú',
    'rui4': 'ruì'
  }],
];
function createTest(desc, pinyin) {
  describe(desc, () => {
    Object.keys(pinyin).forEach((item) => {
      test(item, () => {
        expect(parseNumTone(item)).toEqual(pinyin[item]);
      });
    });
  });
}

describe('parseNumTone的测试用例', () => {
  describe('异常输入', () => {
    test('非String类型', () => {
      expect(parseNumTone(123)).toEqual(123);
    });
    test('空字符串', () => {
      expect(parseNumTone('')).toEqual('');
    });
    test('无数字音调', () => {
      expect(parseNumTone('r')).toEqual('r');
    });
    test('轻音结尾为5', () => {
      expect(parseNumTone('zi5')).toEqual('zi');
    });
    test('存在一个异体', () => {
      expect(parseNumTone('m2')).toEqual('ḿ');
    });
  });
  cases.forEach((item, index) => {
    createTest(index + 1 + '.' + item[0], item[1]);
  });
});
