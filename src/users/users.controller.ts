import { RequestHandler } from "express";
import argon2 from "argon2";
import { prisma } from "../db";
import { CreateUserBody } from "./users.validator";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as CreateUserBody;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409);
      throw new Error("User already exists");
    }

    const hashedPassword = await argon2.hash(password, { saltLength: 16 });

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
