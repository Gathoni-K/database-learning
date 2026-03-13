import { Router } from 'express';
import * as controller from '../controllers/books.controllers';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', controller.addBook);

router.patch('/:id', controller.updateBook);

router.delete('/:id', controller.deleteBook);

export default router;