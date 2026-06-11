import { z } from 'zod';
import { RowSchema } from '../schema/boardConfig';
import type { Row } from '../schema/types';

const ObjectShape = z.object({ rows: z.array(RowSchema) });
const ArrayShape = z.array(RowSchema);

const PollResponseSchema = z.union([ObjectShape, ArrayShape]);

export function parsePollResponse(data: unknown): Row[] {
  const parsed = PollResponseSchema.parse(data);
  return Array.isArray(parsed) ? parsed : parsed.rows;
}
