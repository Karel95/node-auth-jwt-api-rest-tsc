import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

//Tipados Request y Response de Express importados anteriormente en la linea 1:
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body; // Include name in destructuring

  try {
    // Handle errors
    if (!name) {
      res.status(400).json({ message: "El nombre es obligatorio" });
      return;
    }
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);

    // Create the user in the database
    const user = await prisma.create({
      // Use prisma.user.create
      data: {
        name, // Include name
        email,
        password: hashedPassword,
      },
    });

    // Generate a JWT token for the user
    const token = generateToken(user);

    // Respond with success
    res.status(201).json({ message: "Usuario creado con éxito", user, token });
  } catch (error: any) {
    // Handle errors
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El mail ingresado ya existe" });
    }
    console.error(error);
    res.status(500).json({ message: "Error en el registro del usuario" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }

    const user = await prisma.findUnique({ where: { email } }); // Use prisma.user.findUnique
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Usuario y contraseñas no coinciden" });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({ token, name: user.name }); // Include name in the response
    console.log(token);
  } catch (error: any) {
    console.log("Error: ", error);
  }
};
