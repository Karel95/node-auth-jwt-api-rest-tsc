import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";


//Tipados Request y Response de Express importados anteriormente en la linea 1:
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Manejo de errores
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }
        // Hashear la contraseña
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword)
        
        // Crear el usuario en la base de datos
        const user = await prisma.create({
            data: { 
                email, 
                password: hashedPassword
            }
        })

        // Generar un token JWT para el usuario
        const token = generateToken(user)

        // Responder con éxito
        res.status(201).json({ message: "Usuario creado con éxito", user, token });

    } catch (error: any) {
        // Manejo de errores
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        }
        console.error(error);
        res.status(500).json({ message: "Error en el registro del usuario" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        const user = await prisma.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' })
            return
        }

        const token = generateToken(user)
        res.status(200).json({ token })
        console.log(token)


    } catch (error: any) {
        console.log('Error: ', error)
    }
}
