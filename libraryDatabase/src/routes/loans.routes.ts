import { Router } from 'express';
import * as controller from '../controllers/loans.controller';

const router = Router();

router.get('/', controller.getAllLoans);
router.get('/:id', controller.getLoansById);
router.get('/', controller.getOverdueLoans);
router.get('/', controller.getActiveLoans);

router.post('/', controller.addLoans);

router.patch('/:id', controller.updateLoan);

router.delete('/:id', controller.deleteLoan);

export default router;