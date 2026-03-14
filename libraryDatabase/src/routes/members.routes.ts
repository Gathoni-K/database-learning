import { Router } from 'express';
import * as controller from '../controllers/members.controller';

const router = Router();

router.get('/', controller.getAllMembers);
router.get('/:id', controller.getMemberById);

router.post('/', controller.registerMember);

router.patch('/:id', controller.updateMembers);

router.delete('/:id', controller.deleteMembers);

export default router;
