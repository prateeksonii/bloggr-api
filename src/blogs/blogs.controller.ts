import { RequestHandler } from "express";
import superjson from "superjson";
import { prisma } from "../db";
import {
  CreateBlogBody,
  GetBlogBySlugParams,
  LikeBlogParams,
} from "./blogs.validator";

export const createBlog: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body as CreateBlogBody;
    const { userId } = req;
    const slug = title.toLowerCase().split(" ").join("-");

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        slug,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs: RequestHandler = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { author: true, likedBy: true },
    });

    return res.status(200).json(superjson.stringify(blogs));
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as GetBlogBySlugParams;
    const { userId } = req.query;
    const blog = await prisma.blog.findUnique({
      where: {
        slug,
      },
      include: { author: true, likedBy: true },
    });

    return res.status(200).json(
      superjson.stringify({
        blog,
        liked: blog?.likedBy?.some((user) => user.id === userId) ?? false,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getBlogsByUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req;

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      include: {
        likedBy: true,
      },
    });

    return res.status(200).json(superjson.stringify(blogs));
  } catch (error) {
    next(error);
  }
};

export const deleteBlog: RequestHandler = async (req, res, next) => {
  try {
    console.log("firsokt");
    const { blogId } = req.params;

    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const likeBlog: RequestHandler = async (req, res, next) => {
  try {
    const { blogId } = req.params as LikeBlogParams;
    const { userId } = req;

    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const dislikeBlog: RequestHandler = async (req, res, next) => {
  try {
    const { blogId } = req.params as LikeBlogParams;
    const { userId } = req;

    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likedBy: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};
