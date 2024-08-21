import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';

export const generateToken = (user: User): String => {
    return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
}

// export const verifyToken = (token: string) => {}

// export const authenticateToken = async (req: any, res: any, next: any) => {}