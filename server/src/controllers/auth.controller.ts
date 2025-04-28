import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, username } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }

      if (existingUser.username === username) {
        res.status(409).json({ message: "Username already in use" });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username
      }
    });

    res.status(200).json({
      message: "User has been created",
      newUser
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: "Failed to sign up" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // maxAge: 1000 * 60 * 60 // 1 hour
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Failed to login" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Failed to logout" });
  }
};
