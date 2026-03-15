import { Router } from 'express';
import * as controller from '../controllers/fines.controller';



const router = Router();

router.get('/', controller.getAllFines);
router.get('/member/:memberId', controller.getMembersFine);
router.get('/:id', controller.getFinesById);
router.post('/calculate/:loanId', controller.calculateFine);
router.patch('/:id/pay', controller.payFine);

export default router;

