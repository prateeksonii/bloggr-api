import { RequestHandler } from "express";
import { prisma } from "../db";

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { bloggr_token: sessionToken } = req.cookies;

  try {
    if (!sessionToken) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const session = await prisma.session.findUniqueOrThrow({
      where: {
        token: sessionToken,
      },
    });

    req.userId = session.userId;

    return next();
  } catch (error) {
    next(error);
  }
};
