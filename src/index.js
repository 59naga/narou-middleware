import { Router as createRouter } from 'express';
import naroujs from 'naroujs';
import scrapeNarou from 'scrape-narou';

import createR18Middleware from './create-r18-middleware';

export default (options = {}) => {
  const middleware = createRouter();

  if (options.r18) {
    middleware.use('/r18/', createR18Middleware());
  } else {
    middleware.use('/r18/', (req, res) => {
      res.status(403).json({ error: 'このAPIは禁止されています' });
    });
  }

  middleware.get('/toc/:ncode', (req, res) =>
    scrapeNarou.toc(req.params.ncode)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/novel/:ncode/:number', (req, res) =>
    scrapeNarou(req.params.ncode, req.params.number)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/novel/:ncode', (req, res) =>
    scrapeNarou(req.params.ncode, 1)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );

  middleware.get('/shortstory/:ncode', (req, res) =>
    scrapeNarou(req.params.ncode)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );

  middleware.get('/rank/:rtype', (req, res) =>
    naroujs.rank({ rtype: req.params.rtype })
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/fame/:ncode', (req, res) =>
    naroujs.fame({ ncode: req.params.ncode })
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );

  middleware.get('/', (req, res) =>
    naroujs(req.query)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.details }))
  );
  middleware.get('/:word', (req, res) => {
    naroujs({ ...req.params, ...req.query })
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.details }));
  });

  return middleware;
};
