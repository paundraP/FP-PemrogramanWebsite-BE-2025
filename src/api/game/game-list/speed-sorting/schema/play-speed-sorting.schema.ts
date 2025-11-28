import z from 'zod';

import { SpeedSortingTimerModeEnum } from './create-speed-sorting.schema';

export const PlaySpeedSortingSchema = z
  .object({
    timer_mode: SpeedSortingTimerModeEnum,
    timer_duration: z.coerce
      .number()
      .int()
      .positive()
      .max(3600)
      .nullable()
      .optional(),
    speed: z.coerce.number().int().min(100).max(1000),
    lives: z.coerce.number().int().min(0).max(10),
  })
  .superRefine((data, context) => {
    if (data.timer_mode === 'COUNT_DOWN' && !data.timer_duration) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timer_duration'],
        message: 'timer_duration is required when timer_mode is COUNT_DOWN',
      });
    }

    if (data.timer_mode !== 'COUNT_DOWN' && data.timer_duration != null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['timer_duration'],
        message:
          'timer_duration must be null/undefined when timer_mode is not COUNT_DOWN',
      });
    }
  });

export type IPlaySpeedSorting = z.infer<typeof PlaySpeedSortingSchema>;
