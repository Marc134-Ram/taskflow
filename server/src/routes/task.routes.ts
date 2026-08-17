import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

// Mapeo de rutas para Tareas
router.post('/', createTask);        // POST /api/tasks (Crear tarea)
router.patch('/:id', updateTask);    // PATCH /api/tasks/:id (Editar o mover tarea)
router.delete('/:id', deleteTask);   // DELETE /api/tasks/:id (Eliminar tarea)

export default router;