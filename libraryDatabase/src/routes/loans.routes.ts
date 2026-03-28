import { Router } from 'express';
import { validate } from '../middleware/validate';
import { loansSchema, updateLoansSchema } from '../validations/loans.validate';
import * as controller from '../controllers/loans.controller';

const router = Router();

router.get('/', controller.getAllLoans);
router.get('/:id', controller.getLoansById);
router.get('/', controller.getOverdueLoans);
router.get('/', controller.getActiveLoans);

router.post('/', validate(loansSchema), controller.addLoans);

router.patch('/:id', validate(updateLoansSchema), controller.updateLoan);

router.delete('/:id', controller.deleteLoan);

export default router;