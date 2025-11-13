import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import z from 'zod';

export const customErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.union([z.string(), z.number()]).nullish(),
  }),
});

export const customFaildResponseHandler = createJsonErrorResponseHandler({
  errorSchema: customErrorSchema,
  errorToMessage: (error) => error.error.message,
})



