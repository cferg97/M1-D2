import express from "express";
import multer from "multer";
import { extname, dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;
const filesRouter = express.Router();
export const coverUploadRouter = express.Router();
const publicFolderPath = join(process.cwd(), "./public/img/users");

const authorsJSONPath = join(process.cwd(), "./src/authors/authors.json");
const postsJSONPath = join(process.cwd(), "./src/posts/blogPosts.json");

const getAuthors = () => readJSON(authorsJSONPath);
const writeAuthors = (authorsArray) => writeJSON(authorsJSONPath, authorsArray);
const saveUsersAvatar = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsBuffer);

const getPosts = () => readJSON(postsJSONPath);
const writePosts = (postsArray) => writeJSON(postsJSONPath, postsArray);
const savePostCover = (fileName, contentAsBuffer) => {
  writeFile(join(publicFolderPath, fileName), contentAsBuffer);
};

filesRouter.post(
  "/:authorId",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileExtension;
      await saveUsersAvatar(fileName, req.file.buffer);
      const url = `http://localhost:3001/img/users/${fileName}`;
      const users = await getAuthors();
      const index = users.findIndex((user) => user.id === req.params.authorId);
      if (index !== -1) {
        const oldUser = users[index];
        const author = { ...oldUser.author, avatar: url };
        const updatedUser = { ...oldUser, author, updatedAt: new Date() };
        users[index] = updatedUser;
        await writeAuthors(users);
      }
      res.send("File Uploaded");
    } catch (err) {
      next(err);
    }
  }
);

coverUploadRouter.post(
  "/:postid",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.postid + originalFileExtension;
      await savePostCover(fileName, req.file.buffer);
      const url = `http://localhost:3001/img/users/${fileName}`;
      const posts = await getPosts();
      const index = posts.findIndex((post) => post.id === req.params.postid);
      if (index !== -1) {
        const oldPost = posts[index];
        const cover = {...oldPost.cover, cover: url}
        const updatedPost = { ...oldPost, cover, updatedAt: new Date() };
        posts[index] = updatedPost;
        await writePosts(posts);
      }
      res.send("File uploaded");
    } catch (err) {
      next(err);
    }
  }
);

export default filesRouter;