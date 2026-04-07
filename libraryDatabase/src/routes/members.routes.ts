import { Router } from 'express';
import { validate } from '../middleware/validate';
import { membersSchema, updateMembersSchema } from '../validations/members.validate';
import * as controller from '../controllers/members.controller';
import { requireOwnerRole, requireRole } from '../middleware/role.middleware';
import { requireSupabaseAuth } from '../auth/auth.middleware';

const router = Router();

router.get('/', requireSupabaseAuth, requireRole('librarian'), controller.getAllMembers);
router.get('/:id', requireSupabaseAuth, requireOwnerRole('librarian'), controller.getMemberById);

router.post('/', requireSupabaseAuth, requireRole('librarian'), validate(membersSchema), controller.registerMember);

router.patch('/:id', requireSupabaseAuth, requireRole('librarian'), validate(updateMembersSchema), controller.updateMembers);

router.delete('/:id', requireSupabaseAuth, requireRole('librarian'), controller.deleteMembers);

export default router;
