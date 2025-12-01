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

const MIME_TO_EXT: Record<string, string> = {
  ['image/png']: 'png',
  ['image/jpeg']: 'jpg',
  ['image/jpg']: 'jpg',
  ['image/webp']: 'webp',
  ['image/gif']: 'gif',
  ['application/pdf']: 'pdf',
};

function getExtensionFromMime(mime?: string | null): string {
  if (!mime) return 'bin';

  return MIME_TO_EXT[mime] ?? 'bin';
}

function parseDataUrl(value: string): { mime?: string; base64: string } {
  const match = value.match(/^data:([^;]+);base64,(.*)$/);

  if (match) {
    return {
      mime: match[1],
      base64: match[2],
    };
  }

  // no data: prefix, assume whole string is base64
  return {
    mime: undefined,
    base64: value,
  };
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
        const { mime, base64 } = parseDataUrl(item.value);

        const buffer = base64ToBuffer(base64);
        const extension = getExtensionFromMime(mime);

        const filename = `item-${index}.${extension}`;

        return {
          ...item,
          type: 'file' as const,
          raw_value: item.value,
          file: {
            filename,
            mimetype: mime ?? 'application/octet-stream',
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
