import { Router } from 'express';
import { validate } from '../middleware/validate';
import { finesSchema, updateFinesSchema } from '../validations/fines.validate';
import * as controller from '../controllers/fines.controller';



const router = Router();

router.get('/', controller.getAllFines);
router.get('/member/:memberId', controller.getMembersFine);
router.get('/:id', controller.getFinesById);
router.post('/calculate/:loanId', validate(finesSchema), controller.calculateFine);
router.patch('/:id/pay', validate(updateFinesSchema), controller.payFine);

export default router;

