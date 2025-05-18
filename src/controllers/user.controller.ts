import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, profilePic: true },
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, profilePic: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching user" });
  }
};

// PUT update user
export const updateUserProfile = async (req: Request, res: Response) => {
  const id = (req as Request & { userId: string }).userId;
  const { name, profilePic } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, profilePic },
    });

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: "Error updating user" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting user" });
  }
};
