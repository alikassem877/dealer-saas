import { z } from "zod";
import { ApiError } from "@/lib/api/errors";

export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(400, result.error.issues[0].message);
  }
  return result.data;
}