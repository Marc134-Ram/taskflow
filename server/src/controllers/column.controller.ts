import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// 1. Obtener todas las columnas con sus tareas ordenadas
export const getColumns = async (req: Request, res: Response) => {
  try {
    const columns = await prisma.column.findMany({
      orderBy: { order: 'asc' },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });
    res.status(200).json(columns);
  } catch (error) {
    console.error('Error al obtener columnas:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener columnas' });
  }
};

// 2. Crear una nueva columna
export const createColumn = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'El título de la columna es obligatorio' });
      return;
    }

    // Calculamos el orden colocándola al final
    const columnCount = await prisma.column.count();

    const newColumn = await prisma.column.create({
      data: {
        title: title.trim(),
        order: columnCount,
      },
    });

    res.status(201).json(newColumn);
  } catch (error) {
    console.error('Error al crear columna:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear columna' });
  }
};

// 3. Actualizar el título de una columna
export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'El título no puede estar vacío' });
      return;
    }

    const updatedColumn = await prisma.column.update({
      where: { id },
      data: { title: title.trim() },
    });

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error('Error al actualizar columna:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar columna' });
  }
};

// 4. Eliminar una columna (y sus tareas en cascada)
export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.column.delete({
      where: { id },
    });

    res.status(204).send(); // 204 = No Content (operación exitosa sin cuerpo)
  } catch (error) {
    console.error('Error al eliminar columna:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar columna' });
  }
};