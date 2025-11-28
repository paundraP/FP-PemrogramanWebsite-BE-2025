import z from 'zod';

import {
  fileSchema,
  StringToBooleanSchema,
  StringToObjectSchema,
} from '@/common';

export const SpeedSortingTimerModeEnum = z.enum([
  'NONE',
  'COUNT_UP',
  'COUNT_DOWN',
]);

export const SpeedSortingCategoryInputSchema = z.object({
  name: z.string().max(128).trim(),
});

export const SpeedSortingItemInputSchema = z.object({
  text: z.string().max(512).trim(),
  // index of category in categories array (0-based)
  category_index: z.coerce.number().int().min(0).max(100),
});

export const CreateSpeedSortingSchema = z
  .object({
    name: z.string().max(128).trim(),
    description: z.string().max(256).trim().optional(),
    thumbnail_image: fileSchema({}),

    is_publish_immediately: StringToBooleanSchema.default(false),

    show_score_at_end: StringToBooleanSchema.default(true),

    // FE sends JSON string for these
    categories: StringToObjectSchema(
      z.array(SpeedSortingCategoryInputSchema).min(2).max(20),
    ),
    items: StringToObjectSchema(
      z.array(SpeedSortingItemInputSchema).min(1).max(1000),
    ),
  })
  .superRefine((data, context) => {
    // make sure category_index not out-of-range
    const maxIndex = data.categories.length - 1;

    for (const [index, item] of data.items.entries()) {
      if (item.category_index > maxIndex) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['items', index, 'category_index'],
          message: 'category_index out of range',
        });
      }
    }
  });

export type ICreateSpeedSorting = z.infer<typeof CreateSpeedSortingSchema>;
