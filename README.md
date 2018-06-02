# zh_CN
汉字转拼音工具，用于汉语注音

## 特性

+ 基本拼音
+ 支持多音字精确匹配
+ 繁体与简体同样支持
+ 多种拼音风格
+ 体积小，完整的支持为306KB

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
```

## 原理

多音字功能基于cc-cedict