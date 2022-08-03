import { validate } from "../middlewares";
import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogsByUser,
  likeBlog,
} from "./blogs.controller";
import { createBlogValidator } from "./blogs.validator";
import { isAuthenticated } from "../auth/auth.middleware";

const blogRouter = Router();

blogRouter.post(
  "/",
  isAuthenticated,
  validate(createBlogValidator),
  createBlog
);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/user", isAuthenticated, getBlogsByUser);
blogRouter.get("/:slug", getBlogBySlug);
blogRouter.delete("/:blogId", isAuthenticated, deleteBlog);
blogRouter.post("/:blogId/like", isAuthenticated, likeBlog);
blogRouter.post("/:blogId/dislike", isAuthenticated, dislikeBlog);

export default blogRouter;
