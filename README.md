Narou Middleware
---

<p align="right">
  <a href="https://npmjs.org/package/narou-middleware">
    <img src="https://img.shields.io/npm/v/narou-middleware.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/59naga/narou-middleware">
    <img src="http://img.shields.io/travis/59naga/narou-middleware.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/narou-middleware/coverage">
    <img src="https://img.shields.io/codeclimate/github/59naga/narou-middleware.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/narou-middleware">
    <img src="https://img.shields.io/codeclimate/coverage/github/59naga/narou-middleware.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/59naga/narou-middleware">
    <img src="https://img.shields.io/gemnasium/59naga/narou-middleware.svg?style=flat-square">
  </a>
</p>

「[小説家になろう](http://syosetu.com/)」 [Express4](https://github.com/expressjs/express#readme)用 非公式 ミドルウェア

インストール
---
```bash
npm install express narou-middleware --save
```

セットアップ
---

* `createNarouMiddleware(options)` -> `middleware`

  `Express4`用のミドルウェアを返します。`app.use(middleware)`で渡すことで、対象に「[なろうAPI](#api)」を追加します。
  `options`として`{r18:true}`を設定することで、後述の「[API(18禁)](#api(18禁))」を許可します。

  ```js
  // index.js
  import express from 'express';
  import createNarouMiddleware from './src';

  const app = express();
  app.set('json spaces', 2);
  app.use(createNarouMiddleware());
  app.listen(59798, () => {
    console.log('listen on 59798');
  });
  ```

  ```bash
  babel-node index.js
  # listen on 59798
  curl http://localhost:59798/
  # {
  #   "uri": "http://api.syosetu.com/novelapi/api/?out=json&gzip=5",
  #   "allcount": 398177,
  #   "items": [
  #     ...
  ```

API
---
* 一般小説検索API
  * `/`
  * `/?params`
  * `/word?params`

  [なろう小説API - naroujs](https://github.com/59naga/naroujs/blob/master/README.md#%E3%81%AA%E3%82%8D%E3%81%86%E5%B0%8F%E8%AA%ACapi)を参照

* もくじ
  * `/toc/:ncode`

  [`scrapeNarou.toc(ncode)` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

* 本文
  * `/novel/:ncode`
  * `/novel/:ncode/:page`

  [`scrapeNarou(ncode[, page])` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

* 本文（短編）
  * `/shortstory/:ncode`

  [`scrapeNarou(ncode[, page])` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

* ランキング
  * `/rank/:rtype`

  [なろう小説ランキングAPI - naroujs](https://github.com/59naga/naroujs/blob/master/README.md#%E3%81%AA%E3%82%8D%E3%81%86%E5%B0%8F%E8%AA%AC%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0api)を参照

* 殿堂入り
  * `/fame/:ncode`

  [なろう殿堂入りAPI - naroujs](https://github.com/59naga/naroujs/blob/master/README.md#%E3%81%AA%E3%82%8D%E3%81%86%E6%AE%BF%E5%A0%82%E5%85%A5%E3%82%8Aapi)を参照

API(18禁)
---
* 小説検索API
  * `/r18/?params`
  * `/r18/word?params`

  [なろう18禁小説API - naroujs](https://github.com/59naga/naroujs/blob/master/README.md#%E3%81%AA%E3%82%8D%E3%81%8618%E7%A6%81%E5%B0%8F%E8%AA%ACapi)を参照

* 小説もくじ
  * `/r18/toc/:ncode`

  [`scrapeNarou.tocR18(ncode)` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

* 本文
  * `/r18/novel/:ncode`
  * `/r18/novel/:ncode/:page`

  [`scrapeNarou.r18(ncode[, page])` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

* 本文（短編）
  * `/r18/shortstory/:ncode`

  [`scrapeNarou.r18(ncode[, page])` - scrape-narou](https://github.com/59naga/scrape-narou#api)を参照

関連するプロジェクト
---
* [naroujs - NodeJS/ブラウザ用 なろう(小説/小説ランキング/殿堂入り/18禁小説)API JavaScriptラッパ](https://github.com/59naga/naroujs#readme)
* [scrape-narou - NodeJS用 小説本文取得ライブラリ](https://github.com/59naga/scrape-narou#readme)

謝辞
---
このアプリケーションは非公式のもので、[株式会社ヒナプロジェクト](http://hinaproject.co.jp/)様が提供しているものではありません。

開発環境
---
下記が[グローバルインストール](https://github.com/creationix/nvm#readme)されていることが前提です。
* NodeJS v5.11.1
* Npm v3.8.6 (or [pnpm](https://github.com/rstacruz/pnpm))

```bash
git clone https://github.com/59naga/naroujs
cd naroujs
npm install

npm test
```

License
---
[MIT](http://59naga.mit-license.org/)
