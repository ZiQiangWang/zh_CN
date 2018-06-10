# zh_CN

[![NPM version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![gzip](http://img.badgesize.io/https://unpkg.com/zh_cn/dist/zh_cn.min.js?compression=gzip)][unpkg-url]


[npm-badge]: https://img.shields.io/npm/v/zh_cn.svg
[npm-url]: https://www.npmjs.com/package/zh_cn
[npm-downloads]: https://img.shields.io/npm/dm/zh_cn.svg
[travis-badge]: https://www.travis-ci.org/ZiQiangWang/zh_CN.svg?branch=master
[travis-url]: https://www.travis-ci.org/ZiQiangWang/zh_CN
[unpkg-url]: https://unpkg.com/zh_cn/dist/zh_cn.min.js
[coveralls-badge]: https://coveralls.io/repos/ZiQiangWang/zh_CN/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ZiQiangWang/zh_CN


汉字转拼音工具，基于开源字典[cc-cedict](https://www.mdbg.net/chinese/dictionary?page=cedict)解析多音字，[例子](https://ziqiangwang.github.io/zh_CN/demo/index.html)

## 特性

+ 基本拼音
+ 支持多音字精确匹配
+ 繁体与简体同样支持
+ 多种拼音风格
+ 体积小，完整的支持为306KB，gzip压缩后121KB
+ 速度快，2万字转换大概0.58秒

## 安装

```
npm install zh_cn
```

## 用法

```js
var zh = require("zh_cn");

console.log(zh("重庆"));    // ['chong', 'qing']
console.log(zh("重庆", {
  style: zh.STYLE_TONE, // 设置拼音风格
}));                    // ['chóng', 'qìng']
console.log(zh("hello，中国NO.1！", {
  only_chinese: true
}));                       // ['zhong', 'guo']
```

## 浏览器端

```js
<script type="text/javascript" src="https://unpkg.com/zh_cn/dist/zh_cn.min.js"></script>
<script type="text/javascript">
   pinyin.innerText = zh('中文');
</script>
```



## 拼音风格

### `STYLE_NORMAL`

普通风格，不带声调。

如：`zhong guo`

### `STYLE_TONE`

声调风格，按照正常的汉语拼音标注。

如：`zhōng guó`

### `STYLE_TONE_NUM`

声调风格，使用数字音调

如：`zhong1 guo2`

### `STYLE_FIRST_LETTER`

返回每个字的首字母

如：`z g`

## 原理

多音字功能基于开源词典[cc-cedict](https://www.mdbg.net/chinese/dictionary?page=cedict)，原字典8.9M，包含11万多词条，通过裁剪以及调整搜索策略，多音字词典被压缩到133KB，用于辅助搜索的字典17KB。具体原理如下：

### 字典

一共存在四个字典：

- `tradition.dict.js `常用的繁体字转简体字字典
- `words.dict.js` 汉字拼音字典，包括Unicode编码从4E00-9FA5范围内除46个异体字（异体字不存在标准拼音）之外的所有汉字
- `phrases.dict.js`多音词字典，由cc-cedict生成
- `phrases.dict.map.js`多音词字典辅助查询，保存某个字开头的多音词的长度列表，例如，”重“字，其多音词有”重复“和”重峦叠嶂“，那么会保存 {"重": "24" }

### 搜索策略

1. 对于待转义的汉字，进行繁简转换，
2. 遍历待转换的汉字，对每个字去字典`phrases.dict.map.js`中查找，目标文字的位置为i
3. 如果不存在，则认为不是多音字，直接返回`words.dict.js`字典中该文字的第一个读音，i++
4. 如果存在，则获取了以目标文字开头的可能的多音词的长度列表`lengthList`,从尾部开始遍历该列表，截取从目标文字位置i开始的长度为len的文字，去`phrases.dict.js`中查找，如果有结果，则返回该结果，并且i+len，继续向后转化，否则，执行步骤3

### 多音词字典裁剪策略

cc-cedict字典8.9M，去除掉无用信息，转化为对象后，还有3M左右。这种尺寸放在服务端可以勉强接受，但是在浏览器端，特别是移动端，一定需要进一步裁剪。

1. 去掉单个字，因为这些信息在`words.dict.js`中已经有了
2. 如果长度为2或者3的词，则保存到字典repeat中，用以后面对长词和组合词做裁剪
3. 将类似”一日不见，如隔三秋“这样的词组分割成短词
4. 将不包含多音字的词去掉
5. 将包含多音字并且拼音在`words.dict.js`中排第一的词去掉，因为我们的搜索策略在没有多音词结果的情况下，会默认返回第一个读音
6. 使用保存的短词，裁剪多音词字典中的长词，具体策略为：
   1. 长度小于3的直接放过，不进行裁剪
   2. 取目标词的前两个字、前三个字、后两个字、后三个字，检测是否在短词字典repeat中存在
   3. 如果存在，则将目标词剩下的部分进行判断，如果为多音词则保存到结果，并回到步骤2继续裁剪
   4. 如果不存在，则从字典中删除该词

## 缺陷

目前不支持轻音，为了裁剪字典尺寸
