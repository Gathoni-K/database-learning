import { Router } from 'express';
import { validate } from '../middleware/validate';
import { booksSchema, updateBooksSchema } from '../validations/books.validate';
import * as controller from '../controllers/books.controllers';
import { requireRole } from '../middleware/role.middleware';
import { requireSupabaseAuth } from '../auth/auth.middleware';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', requireSupabaseAuth, requireRole('librarian'), validate(booksSchema), controller.addBook);

router.patch('/:id', requireSupabaseAuth, requireRole('librarian'), validate(booksSchema),  controller.updateBook);

router.delete('/:id', requireSupabaseAuth, requireRole('librarian'), controller.deleteBook);

export default router;