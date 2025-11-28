import { type NextFunction, type Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  type AuthedRequest,
  SuccessResponse,
  validateAuth,
  validateBody,
} from '@/common';

import {
  CreateSpeedSortingSchema,
  type ICreateSpeedSorting,
  type IPlaySpeedSorting,
  type IUpdateSpeedSorting,
  PlaySpeedSortingSchema,
  UpdateSpeedSortingSchema,
} from './schema';
import { SpeedSortingService } from './speed-sorting.service';

export const SpeedSortingController = Router()
  // 1) Create template
  .post(
    '/',
    validateAuth({}),
    validateBody({
      schema: CreateSpeedSortingSchema,
      file_fields: [{ name: 'thumbnail_image', maxCount: 1 }],
    }),
    async (
      request: AuthedRequest<{}, {}, ICreateSpeedSorting>,
      response: Response,
      next: NextFunction,
    ) => {
      try {
        const newGame = await SpeedSortingService.createSpeedSorting(
          request.body,
          request.user!.user_id,
        );

        const result = new SuccessResponse(
          StatusCodes.CREATED,
          'Speed Sorting game created',
          newGame,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  // 2) Update template (name/desc/thumb/categories/items/show_score)
  .patch(
    '/:game_id',
    validateAuth({}),
    validateBody({
      schema: UpdateSpeedSortingSchema,
      file_fields: [{ name: 'thumbnail_image', maxCount: 1 }],
    }),
    async (
      request: AuthedRequest<{ game_id: string }, {}, IUpdateSpeedSorting>,
      response: Response,
      next: NextFunction,
    ) => {
      try {
        const updated = await SpeedSortingService.updateSpeedSorting(
          request.params.game_id,
          request.body,
          {
            user_id: request.user!.user_id,
            role: request.user!.role,
          },
        );

        const result = new SuccessResponse(
          StatusCodes.OK,
          'Speed Sorting game updated',
          updated,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  // 3) Play: send timer/speed/lives, get config + dataset
  .post(
    '/:game_id/play',
    validateBody({
      schema: PlaySpeedSortingSchema,
    }),
    async (
      request: AuthedRequest<{ game_id: string }, {}, IPlaySpeedSorting>,
      response: Response,
      next: NextFunction,
    ) => {
      try {
        const data = await SpeedSortingService.getSpeedSortingForPlay(
          request.params.game_id,
          request.body,
        );

        const result = new SuccessResponse(
          StatusCodes.OK,
          'Speed Sorting config and dataset for play',
          data,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  );
