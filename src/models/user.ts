// models/prismaClient.js
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export default prisma.user; // Export the entire client
