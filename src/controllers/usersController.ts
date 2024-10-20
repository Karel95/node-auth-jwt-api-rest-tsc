import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body; // Include name in destructuring

    // Validate the input
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

    // Create user with name, email, and hashed password
    const user = await prisma.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user); // Respond with the created user
  } catch (error: any) {
    // Handle unique constraint violation for email
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El mail ingresado ya existe" });
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
      select: { email: true }, // Selecciona solo el email
    });
    if (!user) {
      res.status(404).json({ error: "El usuario no fue encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;
  try {
    let dataToUpdate: any = { ...req.body };

    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }

    if (email) {
      dataToUpdate.email = email;
    }

    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });

    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ingresado ya existe" });
    } else if (error?.code == "P2025") {
      res.status(404).json("Usuario no encontrado");
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });

    res
      .status(200)
      .json({
        message: `El usuario ${userId} ha sido eliminado`,
      })
      .end();
  } catch (error: any) {
    if (error?.code == "P2025") {
      res.status(404).json("Usuario no encontrado");
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};
