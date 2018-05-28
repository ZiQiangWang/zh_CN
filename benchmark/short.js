const Benchmark = require('benchmark');
const zh = require('../src/index');

const suite = new Benchmark.Suite;

const text = '我爱北京';

// add tests
suite.add('短文本——normal', function() {
  zh(text, {style: zh.STYLE_NORMAL})
})
.add('短文本——tone', function() {
  zh(text, {style: zh.STYLE_TONE})
})
.add('短文本——tone_num', function() {
  zh(text, {style: zh.STYLE_TONE_NUM})
})
.add('短文本——first_letter', function() {
  zh(text, {style: zh.STYLE_FIRST_LETTER})
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run({ 'async': true });
