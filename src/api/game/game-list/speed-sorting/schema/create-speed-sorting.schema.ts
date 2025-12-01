import z from 'zod';

import {
  fileSchema,
  StringToBooleanSchema,
  StringToObjectSchema,
} from '@/common';

const BASE64_REGEX =
  /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}==|[\d+/A-Za-z]{3}=)?$/;

function isBase64(string_: string): boolean {
  if (!string_ || typeof string_ !== 'string') return false;

  const [, maybeBase64] = string_.split(',');
  const raw = maybeBase64 ?? string_;

  if (raw.length % 4 !== 0) return false;

  return BASE64_REGEX.test(raw);
}

function base64ToBuffer(string_: string): Buffer {
  const [, maybeBase64] = string_.split(',');
  const raw = maybeBase64 ?? string_;

  return Buffer.from(raw, 'base64');
}

export const SpeedSortingTimerModeEnum = z.enum([
  'NONE',
  'COUNT_UP',
  'COUNT_DOWN',
]);

export const SpeedSortingCategoryInputSchema = z.object({
  name: z.string().max(128).trim(),
});

export const SpeedSortingItemInputSchema = z.object({
  value: z.string(),
  category_index: z.number().int().nonnegative(),
  type: z.enum(['text', 'file']).optional(),
});

export const CreateSpeedSortingSchema = z
  .object({
    name: z.string().max(128).trim(),
    description: z.string().max(256).trim().optional(),
    thumbnail_image: fileSchema({}),

    is_publish_immediately: StringToBooleanSchema.default(false),

    categories: StringToObjectSchema(
      z.array(SpeedSortingCategoryInputSchema).min(2).max(20),
    ),
    items: StringToObjectSchema(
      z.array(SpeedSortingItemInputSchema).min(1).max(1000),
    ),
  })
  .superRefine((data, context) => {
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
  })
  .transform(data => ({
    ...data,
    items: data.items.map((item, index) => {
      if (isBase64(item.value) || item.type === 'file') {
        const buffer = base64ToBuffer(item.value);

        return {
          ...item,
          type: 'file' as const,
          raw_value: item.value,
          file: {
            filename: `item-${index}.bin`,
            mimetype: 'application/octet-stream',
            buffer,
          },
        };
      }

      return {
        ...item,
        type: 'text' as const,
      };
    }),
  }));

export type ICreateSpeedSorting = z.infer<typeof CreateSpeedSortingSchema>;
