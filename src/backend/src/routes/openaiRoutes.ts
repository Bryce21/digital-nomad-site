import express, { NextFunction, Request, Response } from 'express';
import * as OpenAiService from '../services/openaiService';
import { query, validationResult, matchedData } from 'express-validator';
const openaiRouter = express.Router();

openaiRouter.get(
  '/food',
  //   todo make env variable for max length here
  query('location').notEmpty().isString().isLength({ max: 100 }).escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new Error(`Validation error: ${JSON.stringify(result.array())}`);
      }
      const data = matchedData(req);
      const { location } = data;
      const aiRes = await OpenAiService.sendQuery(
        OpenAiService.questionBases.food,
        location,
      );
      res.json(aiRes);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

export { openaiRouter };
