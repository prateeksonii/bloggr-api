import { RequestHandler } from "express";
import argon2 from "argon2";
import { prisma } from "../db";
import { randomUUID } from "crypto";
import { SignInBody } from "./auth.validator";

export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as SignInBody;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      res.status(401);
      throw new Error("Invalid password");
    }

    const sessionToken = randomUUID();

    await prisma.session.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        token: sessionToken,
      },
      update: {
        token: sessionToken,
      },
    });

    res.cookie("bloggr_token", sessionToken, {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: false,
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signOut: RequestHandler = async (req, res, next) => {
  console.log("cookies", req.cookies);

  const { bloggr_token: sessionToken } = req.cookies;

  try {
    await prisma.session.delete({
      where: {
        token: sessionToken,
      },
    });

    res.clearCookie("bloggr_token");
    res.status(200).json({ message: "Signed out" });
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const { userId } = req;

  try {
    if (!userId) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
