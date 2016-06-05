// dependencies
import 'babel-polyfill';
import request from 'supertest';
import assert from 'assert';
import express from 'express';

// target
import createNarouMiddleware from '../src';
import createR18Middleware from '../src/create-r18-middleware';

// specs
describe('narou-middleware', () => {
  describe('createNarouMiddleware', () => {
    const app = express();
    app.use(createNarouMiddleware());

    describe('/ - 検索', () => {
      it('デフォルト20件を返すべき', (done) => {
        request(app)
        .get('/?of=t-nt')
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount > body.items.length);
          assert(body.items.length === 20);
        })
        .end(done);
      });

      it('userid=288399で絞込できるべき', (done) => {
        const userId = 288399;
        request(app)
        .get(`/?userid=${userId}`)
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount === body.items.length);
          assert(body.items.length >= 9);

          body.items.forEach(item => {
            assert(item.userid === userId);
          });
        })
        .end(done);
      });

      it('「理不尽な孫の手」で絞込できるべき', (done) => {
        request(app)
        .get(`/${encodeURIComponent('理不尽な孫の手')}`)
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount === body.items.length);
          assert(body.items.length >= 9);
        })
        .end(done);
      });

      it('不正な引数はエラーを返すべき', (done) => {
        request(app)
        .get('/?invalid=1&illegal=1')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error.length === 2);
          assert(body.error[0].message === '"invalid" is not allowed');
          assert(body.error[1].message === '"illegal" is not allowed');
        })
        .end(done);
      });

      it('r18にはアクセスできない', (done) => {
        request(app)
        .get('/r18/')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error === 'このAPIは禁止されています');
        })
        .end(done);
      });
    });

    describe('/toc/ - もくじ', () => {
      it('ncode=N9669BKのもくじ情報を返すべき', (done) => {
        request(app)
        .get('/toc/N9669BK')
        .expect(200)
        .expect(({ body }) => {
          const { count, author, authorId, title, chapters } = body;
          assert(count === 286);
          assert(author === '理不尽な孫の手');
          assert(authorId === '288399');
          assert(title === '無職転生　- 異世界行ったら本気だす -');
          assert(chapters.length === 25);
        })
        .end(done);
      });

      it('短編はエラーを返すべき', (done) => {
        request(app)
        .get('/toc/n1354ck')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error === 'no chapters found');
        })
        .end(done);
      });
    });

    describe('/novel/ - 本文', () => {
      it('ncode=N9669BKの1ページ目の情報を返すべき', (done) => {
        request(app)
        .get('/novel/N9669BK')
        .expect(200)
        .expect(({ body }) => {
          const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = body;
          assert(uri === 'http://ncode.syosetu.com/N9669BK/1/');
          assert(page === 1);
          assert(count === 286);
          assert(author === '理不尽な孫の手');
          assert(authorId === '288399');
          assert(title === '無職転生　- 異世界行ったら本気だす -');
          assert(chapter === '第１章　幼年期');
          assert(subtitle === 'プロローグ');
          assert(content.match(/^俺は34歳住所不定無職/));
          assert(content.match(/トマトみたいに潰れて死んだ。$/));
          assert(header === '');
          assert(footer === '');
          assert(ad === '');
          assert(next === 2);
          assert(prev === null);
        })
        .end(done);
      });

      it('ncode=N9669BKの286ページ目の情報を返すべき', (done) => {
        request(app)
        .get('/novel/N9669BK/286')
        .expect(200)
        .expect(({ body }) => {
          const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = body;
          assert(uri === 'http://ncode.syosetu.com/N9669BK/286/');
          assert(page === 286);
          assert(count === 286);
          assert(author === '理不尽な孫の手');
          assert(authorId === '288399');
          assert(title === '無職転生　- 異世界行ったら本気だす -');
          assert(chapter === '最終章　完結編');
          assert(subtitle === 'エピローグ「プロローグ・ゼロ」');
          assert(content.match(/^甲龍暦500年/));
          assert(content.match(/まだ、誰にも分からない。$/));
          assert(header === '');
          assert(footer.match(/^<br>/));
          assert(footer.match(/ご愛読、誠にありがとうございました。$/));
          assert(ad === '');
          assert(next === null);
          assert(prev === 285);
        })
        .end(done);
      });

      it('短編はエラーを返すべき', (done) => {
        request(app)
        .get('/novel/n1354ck')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error.match(/URLが不正です。/));
        })
        .end(done);
      });
    });

    describe('/shortstory/ - 本文（短編）', () => {
      it('n1354ckの本文情報を返すべき', (done) => {
        request(app)
        .get('/shortstory/n1354ck')
        .expect(200)
        .expect(({ body }) => {
          const { uri, author, authorId, series, seriesId, title, content } = body;
          assert(uri === 'http://ncode.syosetu.com/n1354ck/');
          assert(author === '結木さんと');
          assert(authorId === '270309');
          assert(series === 'お菓子な世界より');
          assert(seriesId === 's5859c');
          assert(title === 'いやだってお菓子あげたらついてくるっていうからさぁ！！');
          assert(content.match(/^<br>\n　混沌たる群集の中/)); // eslint-disable-line no-irregular-whitespace
          assert(content.match(/ほんとに覚えててくださいね。<br>\n<br>\n<br>\n<br>$/));
        })
        .end(done);
      });

      it('長編はエラーを返すべき', (done) => {
        request(app)
        .get('/shortstory/N9669BK')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error === 'TOC can not extract');
        })
        .end(done);
      });
    });

    describe('/rank/ - ランキング', () => {
      it('rtype=20130501-mの結果を返すべき', (done) => {
        request(app)
        .get('/rank/20130501-m')
        .expect(200)
        .expect(({ body }) => {
          const first = body.items[0];
          assert(first.ncode === 'N7648BN');
          assert(first.pt === 36092);
          assert(first.rank === 1);
          assert(body.items.length === 300);
        })
        .end(done);
      });
    });

    describe('/fame/ - 殿堂入り', () => {
      it('ncode=n9669bkの結果を返すべき', (done) => {
        request(app)
        .get('/fame/n9669bk')
        .expect(200)
        .expect(({ body }) => {
          const first = body.items[0];
          assert(first.pt === 623);
          assert(first.rank === 11);
          assert(first.rtype === '20130501-d');
          assert(body.items.length >= 1368);
        })
        .end(done);
      });
    });
  });

  describe('createR18Middleware', () => {
    const appR18 = express();
    appR18.use(createR18Middleware());

    describe('/ - 検索', () => {
      it('デフォルト20件を返すべき', (done) => {
        request(appR18)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount > body.items.length);
          assert(body.items.length === 20);
        })
        .end(done);
      });

      it('xid=x8841nで絞込できるべき', (done) => {
        const xid = 'x8841n';
        request(appR18)
        .get(`/?xid=${xid}`)
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount === body.items.length);
          assert(body.items.length >= 2);

          // FIXME apiのデータ内にxidが存在しない
          // body.items.forEach(item => {
          //   assert(item.xid === xid);
          // });
        })
        .end(done);
      });

      it('「磯貝武連」で絞込できるべき', (done) => {
        request(appR18)
        .get(`/${encodeURIComponent('磯貝武連')}`)
        .expect(200)
        .expect(({ body }) => {
          assert(body.allcount === body.items.length);
          assert(body.items.length >= 2);
        })
        .end(done);
      });

      it('不正な引数はエラーを返すべき', (done) => {
        request(appR18)
        .get('/?invalid=1&illegal=1')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error.length === 2);
          assert(body.error[0].message === '"invalid" is not allowed');
          assert(body.error[1].message === '"illegal" is not allowed');
        })
        .end(done);
      });
    });

    describe('/toc/ - もくじ', () => {
      it('ncode=N9669BKのもくじ情報を返すべき', (done) => {
        request(appR18)
        .get('/toc/n7663ct')
        .expect(200)
        .expect(({ body }) => {
          const { count, author, authorId, title, chapters, episodes } = body;
          assert(count >= 340);
          assert(author === '磯貝武連');
          assert(authorId === 'x8841n');
          assert(title === 'エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。');
          assert(chapters.length === 0);
          assert(episodes.length === count);
        })
        .end(done);
      });

      it('短編はエラーを返すべき', (done) => {
        request(appR18)
        .get('/toc/n1354ck')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error === 'no chapters found');
        })
        .end(done);
      });
    });

    describe('/novel/ - 本文', () => {
      it('ncode=n7663ctの1ページ目の情報を返すべき', (done) => {
        request(appR18)
        .get('/novel/n7663ct/1')
        .expect(200)
        .expect(({ body }) => {
          const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = body;
          assert(uri === 'http://novel18.syosetu.com/n7663ct/1/');
          assert(page === 1);
          assert(count >= 340);
          assert(author === '磯貝武連');
          assert(authorId === 'x8841n');
          assert(title === 'エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。');
          assert(chapter === '');
          assert(subtitle === '詐欺師からの大出世');
          assert(content.match(/^荘厳かつ華麗でありながら/));
          assert(content.match(/弦楽器にしてやりたくなるキースだった。$/));
          assert(header === '');
          assert(footer === 'もう一つ書かせてもらっている方が全然エロくならないので、エロが書きたいとフラストレーションが溜まった結果出来た作品です。');
          assert(ad === '');
          assert(next === 2);
          assert(prev === null);
        })
        .end(done);
      });

      it('短編はエラーを返すべき', (done) => {
        request(appR18)
        .get('/novel/n1354ck')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error.match(/URLが不正です。/));
        })
        .end(done);
      });
    });

    describe('/shortstory/ - 本文（短編）', () => {
      it('ncode=N6823CHの小説を返すべき', (done) => {
        request(appR18)
        .get('/shortstory/N6823CH')
        .expect(200)
        .expect(({ body }) => {
          const { uri, author, authorId, series, seriesId, title, content, header, footer, ad } = body;
          assert(uri === 'http://novel18.syosetu.com/N6823CH/');
          assert(author === 'きー子');
          assert(authorId === 'x8570b');
          assert(series === '');
          assert(seriesId === '');
          assert(title === '姫将軍の肖像');
          assert(content.match(/^「リントブルム辺境伯軍麾下へ/));
          assert(content.match(/その少女時代の輝きがそこにあった。$/));
          assert(header === '暗いです。<br>\nエロくないです。');
          assert(footer === '');
          assert(ad.match(/webclap.com/));
        })
        .end(done);
      });

      it('長編はエラーを返すべき', (done) => {
        request(appR18)
        .get('/shortstory/N9669BK')
        .expect(403)
        .expect(({ body }) => {
          assert(body.error === 'TOC can not extract');
        })
        .end(done);
      });
    });
  });
});
