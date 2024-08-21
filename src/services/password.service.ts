import bcrypt from "bcrypt";

const saltRounds: number = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds)
}

//Leer y comparar con el hash de la base de datos:
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}


