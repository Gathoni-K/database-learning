import { Router } from 'express';
import { validate } from '../middleware/validate';
import { booksSchema, updateBooksSchema } from '../validations/books.validate';
import * as controller from '../controllers/books.controllers';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', validate(booksSchema), controller.addBook);

router.patch('/:id', validate(updateBooksSchema), controller.updateBook);

router.delete('/:id', controller.deleteBook);

export default router;