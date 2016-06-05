import { Router as createRouter } from 'express';
import naroujs from 'naroujs';
import scrapeNarou from 'scrape-narou';

export default () => {
  const middleware = createRouter();

  middleware.get('/toc/:ncode', (req, res) =>
    scrapeNarou.tocR18(req.params.ncode)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/novel/:ncode/:number', (req, res) =>
    scrapeNarou.r18(req.params.ncode, req.params.number)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/novel/:ncode', (req, res) =>
    scrapeNarou.r18(req.params.ncode, 1)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );
  middleware.get('/shortstory/:ncode', (req, res) =>
    scrapeNarou.r18(req.params.ncode)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.message }))
  );

  middleware.get('/', (req, res) =>
    naroujs.r18(req.query)
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.details }))
  );
  middleware.get('/:word', (req, res) => {
    naroujs.r18({ ...req.params, ...req.query })
    .then((result) => res.json(result))
    .catch((error) => res.status(403).json({ error: error.details }));
  });

  return middleware;
};
