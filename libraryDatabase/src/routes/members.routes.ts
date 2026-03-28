import { Router } from 'express';
import { validate } from '../middleware/validate';
import { membersSchema, updateMembersSchema } from '../validations/members.validate';
import * as controller from '../controllers/members.controller';

const router = Router();

router.get('/', controller.getAllMembers);
router.get('/:id', controller.getMemberById);

router.post('/', validate(membersSchema), controller.registerMember);

router.patch('/:id', validate(updateMembersSchema), controller.updateMembers);

router.delete('/:id', controller.deleteMembers);

export default router;
