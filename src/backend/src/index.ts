import express, { Express, Request } from 'express';

import { openaiRouter } from './routes/openaiRoutes';
import { placesRouter } from './routes/placesRoutes';
import { connectToDatabase, initializeDB } from './services/database';
import { suggestionRouter } from './routes/suggestion';
import Logger from './services/logger';
import { viatorRouter } from './routes/viatorRoutes';
import morgan from 'morgan';

const app: Express = express();
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
  if (req.path === '/healthz') return next(); // Skip logging for health check
  morgan('common')(req, res, next);
});

const port = process.env.PORT || 3000;

// set cors - todo restrict this more eventually
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use('/openai', openaiRouter);

app.use('/places', placesRouter);

app.use('/suggestions', suggestionRouter);

app.use('/viator', viatorRouter);

app.use('/healthz', (req, res) => {
  res.json({ ok: true });
});

const startApiServer = () => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

connectToDatabase()
  .then(() => initializeDB())
  .then(() => startApiServer())
  .catch((err) => {
    Logger.error(`Error connecting to database: ${err}`);
    console.log(`Error starting api: ${err}`);
    process.exit(1);
  });
