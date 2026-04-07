import { Router } from 'express';
import * as finesController from '../controllers/fines.controller';
import { requireSupabaseAuth } from '../auth/auth.middleware';
import { requireRole, requireOwnerRole } from '../middleware/role.middleware';


const router = Router();


// members see their own fines
router.get('/my-fines', requireSupabaseAuth, requireRole('member'), finesController.getMyFines);


// librarians manage all fines
router.get('/', requireSupabaseAuth, requireRole('librarian'), finesController.getAllFines);
router.get('/member/:memberId', requireSupabaseAuth, requireRole('librarian'), finesController.getMembersFine);
router.post('/calculate/:loanId', requireSupabaseAuth, requireRole('librarian'), finesController.calculateFine);
router.patch('/:id/pay', requireSupabaseAuth, requireRole('librarian'), finesController.payFine);


// member sees their own fine, librarian sees any fine
router.get('/:id', requireSupabaseAuth, requireOwnerRole('librarian'), finesController.getFinesById);

export default router;