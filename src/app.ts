import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
const app = express()
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/userRoutes';

// Middleware for parsing JSON request bodies
app.use(express.json())

// Routes:
//Authentication:
app.use('/auth', authRoutes)

//User. Api rest:
app.use('/users', usersRoutes)

console.log("Hello world")

export  default app
