import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import columnRoutes from './routes/column.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'TaskFlow API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Registrar rutas de la API
app.use('/api/columns', columnRoutes);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});