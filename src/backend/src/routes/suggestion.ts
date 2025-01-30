import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { query, validationResult, matchedData, body } from 'express-validator';
import { createSuggestion } from '../services/suggestionService';

const suggestionRouter = express.Router();

suggestionRouter.post(
  '/create',
  body('suggestion')
    .notEmpty()
    .trim()
    .isString()
    .isLength({ max: 2000 })
    .escape(),
  body('contact').notEmpty().trim().isEmail().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new Error(`Validation error: ${JSON.stringify(result.array())}`);
      }
      const data = matchedData(req);

      await createSuggestion(data.suggestion, data.contact);
      return res.json({
        created: true,
      });
    } catch (err) {
      console.error('Error creating suggestion: ', err);
      next(err);
    }
  },
);

export { suggestionRouter };
