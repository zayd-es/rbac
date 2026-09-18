import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role, User } from "../generated/prisma";
import db from "./db";
import { cache } from "react";

const JWT_SECRET = process.env.JWT_SECRET!;
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generatetoken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

type TokenPayload = {
  userId: string;
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const getCurrentUser = cache(
  async (): Promise<Omit<User, "password"> | null> => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (!token) return null;

      const decode = verifyToken(token);
      if (!decode || !decode.userId) return null;

      const userFromDb = await db.user.findUnique({
        where: { id: decode.userId },
      });

      if (!userFromDb) return null;

      const { password, ...user } = userFromDb;
      return user as Omit<User, "password">;
    } catch (error: any) {
      console.log("Error", error);
      return null;
    }
  },
);

const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.USER]: 1,
  [Role.MANAGER]: 2,
  [Role.ADMIN]: 3,
};

export const checkUserPermission = (
  userRole: Role,
  requiredRole: Role,
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
