/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
import { Router } from 'express';

import { QuizController } from './quiz/quiz.controller';
import { SpeedSortingController } from './speed-sorting/speed-sorting.controller';

const GameListRouter = Router();

GameListRouter.use('/quiz', QuizController);
GameListRouter.use('/speed-sorting', SpeedSortingController);

export default GameListRouter;
