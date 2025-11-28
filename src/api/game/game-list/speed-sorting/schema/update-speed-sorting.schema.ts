import z from 'zod';

import {
  fileSchema,
  StringToBooleanSchema,
  StringToObjectSchema,
} from '@/common';

import {
  SpeedSortingCategoryInputSchema,
  SpeedSortingItemInputSchema,
} from './create-speed-sorting.schema';

export const UpdateSpeedSortingSchema = z.object({
  name: z.string().max(128).trim().optional(),
  description: z.string().max(256).trim().optional(),
  thumbnail_image: fileSchema({}).optional(),

  // toggle publish if you need it
  is_publish: StringToBooleanSchema.optional(),

  show_score_at_end: StringToBooleanSchema.optional(),

  // When updating dataset, we will REPLACE categories + items
  categories: StringToObjectSchema(
    z.array(SpeedSortingCategoryInputSchema).min(2).max(20),
  ).optional(),
  items: StringToObjectSchema(
    z.array(SpeedSortingItemInputSchema).min(1).max(1000),
  ).optional(),
});

export type IUpdateSpeedSorting = z.infer<typeof UpdateSpeedSortingSchema>;
