import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
const app = express()
const cors = require('cors');
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/userRoutes';

// Middleware for parsing JSON request bodies
app.use(express.json())

// Permitir todas las solicitudes de todos los orígenes
app.use(cors());

// O permitir solo tu dominio de frontend
app.use(cors({
  origin: 'http://localhost:5173'  // Cambia por tu dominio en producción si es necesario
}));

// Routes:
//Authentication:
app.use('/auth', authRoutes)

//User. Api rest:
app.use('/users', usersRoutes)

console.log("Hello world")

export default app
