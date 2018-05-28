const pinyin = require('../src/index');

const cases = [

  ['空', '', {
    STYLE_NORMAL: [],
    STYLE_TONE: [],
    STYLE_TONE_NUM: [],
    STYLE_FIRST_LETTER: []
  }],
  ['单音字', '我', {
    STYLE_NORMAL: ['wo'],
    STYLE_TONE: ['wǒ'],
    STYLE_TONE_NUM: ['wo3'],
    STYLE_FIRST_LETTER: ['w']
  }],
  ['多音字', '中', {
    STYLE_NORMAL: ['zhong'],
    STYLE_TONE: ['zhōng'],
    STYLE_TONE_NUM: ['zhong1'],
    STYLE_FIRST_LETTER: ['z']
  }],
  ['多音词', '重庆', {
    STYLE_NORMAL: ['chong', 'qing'],
    STYLE_TONE: ['chóng', 'qìng'],
    STYLE_TONE_NUM: ['chong2', 'qing4'],
    STYLE_FIRST_LETTER: ['c', 'q']
  }],
  ['繁体', '我愛交響樂', {
    STYLE_NORMAL: ['wo', 'ai', 'jiao', 'xiang', 'yue'],
    STYLE_TONE: ['wǒ', 'ài', 'jiāo', 'xiǎng', 'yuè'],
    STYLE_TONE_NUM: ['wo3', 'ai4', 'jiao1', 'xiang3', 'yue4'],
    STYLE_FIRST_LETTER: ['w', 'a', 'j', 'x', 'y']
  }],
  ['中英文混合', 'hello中国', {
    STYLE_NORMAL: ['hello', 'zhong', 'guo'],
    STYLE_TONE: ['hello', 'zhōng', 'guó'],
    STYLE_TONE_NUM: ['hello', 'zhong1', 'guo2'],
    STYLE_FIRST_LETTER: ['hello', 'z', 'g']
  }],
  ['英文', 'a', {
    STYLE_NORMAL: ['a'],
    STYLE_TONE: ['a'],
    STYLE_TONE_NUM: ['a'],
    STYLE_FIRST_LETTER: ['a']
  }],
  ['带空格', 'a a', {
    STYLE_NORMAL: ['a a'],
    STYLE_TONE: ['a a'],
    STYLE_TONE_NUM: ['a a'],
    STYLE_FIRST_LETTER: ['a a']
  }],
  ['多音字但不存在于词典中', '且怒且悲', {
    STYLE_NORMAL: ['qie', 'nu', 'qie', 'bei'],
    STYLE_TONE: ['qiě', 'nù', 'qiě', 'bēi'],
    STYLE_TONE_NUM: ['qie3', 'nu4', 'qie3', 'bei1'],
    STYLE_FIRST_LETTER: ['q', 'n', 'q', 'b']
  }],
  ['过滤掉汉字之外的内容', 'hello，中国NO.1！', {
    STYLE_NORMAL: ['zhong', 'guo'],
    STYLE_TONE: ['zhōng', 'guó'],
    STYLE_TONE_NUM: ['zhong1', 'guo2'],
    STYLE_FIRST_LETTER: ['z', 'g']
  }, {only_chinese: true}],
];
//
// function createTest(desc, words, styles, options = {}) {
//   describe(desc, () => {
//     Object.keys(styles).forEach((item, index) => {
//       test(String.fromCharCode(97 + index) + '.' + item, () => {
//         expect(pinyin(words, Object.assign({}, {style: pinyin[item]}, options))).toEqual(styles[item]);
//       });
//     });
//   });
// }
//
// describe('pinyin的测试用例', () => {
//   describe('非字符串输入', () => {
//     test('1、数字', () => {
//       expect(pinyin.bind(null, 12)).toThrow();
//     });
//   });
//   cases.forEach((item, index) => {
//     createTest(index + 1 + '.' + item[0], item[1], item[2], item[3]);
//   });
// });

var colors = require( 'colors');

cases.forEach((item, index) => {
  const desc = item[0];
  const words = item[1];
  const styles = item[2];
  const options = item[3];
  console.log(index + '.' + desc, words);
  Object.keys(styles).forEach(style => {
    const result = pinyin(words, Object.assign({}, {style: pinyin[style]}, options));
    const passed = JSON.stringify(result) === JSON.stringify(styles[style]);
    if (passed) {
      console.log(style, '通过'.green);
    } else {
      console.log(style, 'expected:'.green, styles[style], 'recieved:'.red, result, '不通过'.red);
    }
  });
});
