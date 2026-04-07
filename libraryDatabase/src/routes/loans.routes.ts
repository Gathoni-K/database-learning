import { Router } from 'express';
import { validate } from '../middleware/validate';
import { loansSchema, updateLoansSchema } from '../validations/loans.validate';
import * as loansController from '../controllers/loans.controller';
import { requireSupabaseAuth } from '../auth/auth.middleware';
import { requireOwnerRole, requireRole } from '../middleware/role.middleware';


const router = Router();

router.get('/my-loans', requireSupabaseAuth, requireRole('member'), loansController.getMyLoans);

router.get('/', requireSupabaseAuth, requireRole('librarian'), loansController.getAllLoans);
router.get('/:id', requireSupabaseAuth, requireOwnerRole('librarian'), loansController.getLoansById);
router.get('/overdue', requireSupabaseAuth, requireRole('librarian'), loansController.getOverdueLoans);
router.get('/active', requireSupabaseAuth, requireRole('librarian'), loansController.getActiveLoans);

router.post('/', requireSupabaseAuth, requireRole('librarian'), validate(loansSchema), loansController.addLoans);

router.patch('/:id', requireSupabaseAuth, requireOwnerRole('librarian'), validate(updateLoansSchema), loansController.updateLoan);

router.delete('/:id', requireSupabaseAuth, requireRole('librarian'), loansController.deleteLoan);

export default router;