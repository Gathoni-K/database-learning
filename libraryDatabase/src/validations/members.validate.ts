// file holding the validation for user data.

import { z } from 'zod';

export const membersSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    phoneNumber: z.string().min(1),
});

export const updateMembersSchema = membersSchema.partial();

export type membersInput = z.infer<typeof membersSchema>;
export type updateMembersInput = z.infer<typeof updateMembersSchema>;
