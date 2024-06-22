import express, { Express } from 'express';

import { openaiRouter } from './routes/openaiRoutes';
import { placesRouter } from './routes/placesRoutes';
import { connectToDatabase } from './services/database';
import { suggestionRouter } from './routes/suggestion';

const app: Express = express();
app.use(express.json());
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

const startApiServer = () => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

connectToDatabase()
  // todo setup mongo indexes
  .then(() => startApiServer())
  .catch((err) => {
    console.error('Error connecting to database');
    process.exit(1);
  });
