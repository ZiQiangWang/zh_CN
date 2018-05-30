var colors = require( 'colors');
const zh = require('../src/index');
const testDict = require('../data/phrases_test.dict.js');


// describe('使用cc-cedict生成的字典测试', () => {
//   Object.keys(testDict).forEach((word) => {
//     test(word, () => {
//       expect(zh(word, {style: zh.STYLE_TONE_NUM})).toEqual(testDict[word].replace(/,/g,'，').split(' '));
//     });
//   });
// });

let count = 0;
Object.keys(testDict).forEach((word) => {
  const result = zh(word, Object.assign({}, {style: zh.STYLE_TONE_NUM})).join(' ');
  const expect = testDict[word].replace(/,/g,'，');
  const passed = result === expect;

  if (passed) {
    // console.log(word, '通过'.green);
  } else {
    count++;
    console.log(word, 'expected: '.green, expect, 'recieved: '.red, result, '不通过'.red);
  }
});

console.log(count/Object.keys(testDict).length);
