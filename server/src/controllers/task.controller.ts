import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Priority } from '@prisma/client';

// 1. Crear una nueva tarea dentro de una columna
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, columnId } = req.body;

    // Validación de campos obligatorios
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'El título de la tarea es obligatorio' });
      return;
    }

    if (!columnId || typeof columnId !== 'string') {
      res.status(400).json({ error: 'El ID de la columna (columnId) es obligatorio' });
      return;
    }

    // Comprobamos que la columna existe realmente en la base de datos
    const columnExists = await prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!columnExists) {
      res.status(404).json({ error: 'La columna especificada no existe' });
      return;
    }

    // Calculamos el orden de la nueva tarea (al final de la columna)
    const taskCount = await prisma.task.count({
      where: { columnId },
    });

    // Validamos que la prioridad sea válida según el Enum (LOW, MEDIUM, HIGH)
    const validPriority = Object.values(Priority).includes(priority)
      ? priority
      : Priority.MEDIUM;

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        priority: validPriority,
        order: taskCount,
        columnId,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear tarea' });
  }
};

// 2. Actualizar una tarea (título, descripción, prioridad, columna o posición)
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, columnId, order } = req.body;

    // Verificamos que la tarea exista
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Construimos un objeto con solo los campos que el cliente envió para actualizar
    const dataToUpdate: {
      title?: string;
      description?: string | null;
      priority?: Priority;
      columnId?: string;
      order?: number;
    } = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'El título no puede estar vacío' });
        return;
      }
      dataToUpdate.title = title.trim();
    }

    if (description !== undefined) {
      dataToUpdate.description = description ? description.trim() : null;
    }

    if (priority !== undefined) {
      if (!Object.values(Priority).includes(priority)) {
        res.status(400).json({ error: 'Prioridad inválida. Debe ser LOW, MEDIUM o HIGH' });
        return;
      }
      dataToUpdate.priority = priority;
    }

    if (columnId !== undefined) {
      // Si se mueve de columna, comprobamos que la nueva columna exista
      const targetColumn = await prisma.column.findUnique({
        where: { id: columnId },
      });
      if (!targetColumn) {
        res.status(404).json({ error: 'La columna de destino no existe' });
        return;
      }
      dataToUpdate.columnId = columnId;
    }

    if (order !== undefined) {
      dataToUpdate.order = Number(order);
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar tarea' });
  }
};

// 3. Eliminar una tarea por su ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar tarea' });
  }
};