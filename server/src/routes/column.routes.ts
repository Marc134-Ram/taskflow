import { Router } from 'express';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '../controllers/column.controller';

const router = Router();

// Mapeo de rutas a sus funciones del controlador
router.get('/', getColumns);          // GET /api/columns
router.post('/', createColumn);        // POST /api/columns
router.patch('/:id', updateColumn);    // PATCH /api/columns/:id
router.delete('/:id', deleteColumn);   // DELETE /api/columns/:id

export default router;