import { z } from 'zod';

export const finesSchema = z.object({
    loansId: z.uuid(),
});

export const updateFinesSchema = finesSchema.partial();

export type finesInput = z.infer<typeof finesSchema>;
export type updateFinesInput = z.infer<typeof updateFinesSchema>;

