import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkPostSchema, triggerBadRequest } from "./validator.js";
import { emitWarning } from "process";

const postsRouter = express.Router();
const { NotFound, Unauthorized, BadRequest } = httpErrors;
const blogpostsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
const fileContent = fs.readFileSync(blogpostsJSONpath);
const blogpostsArray = JSON.parse(fileContent);
const writeToFile = () =>
  fs.writeFileSync(blogpostsJSONpath, JSON.stringify(blogpostsArray));
const findPost = (postid) => {
  return blogpostsArray.find((post) => post.id === postid);
};

postsRouter.get("/", (req, res) => {
  res.send(blogpostsArray);
});

postsRouter.post("/", checkPostSchema, triggerBadRequest, (req, res, next) => {
  try {
    const newPost = {
      ...req.body,
      id: uniqid(),
      category: req.body.category,
      title: req.body.title,
      // cover: req.body.cover,
      author: {
        name: req.body.author.name,
        avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`,
      },
      content: req.body.content,
      createdAt: new Date(),
    };
    blogpostsArray.push(newPost);
    writeToFile();
    res.status(201).send({ id: newPost.id });
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/:postid", (req, res) => {
  const postid = req.params.postid;
  res.send(findPost(postid));
});

postsRouter.put("/:postid", (req, res) => {
  const avatar = req.body.author.name
    ? `https://ui-avatars.com/api/?name=${req.body.author.name}`
    : `https://ui-avatars.com/api/?name=${oldPost.author.name}`;

  console.log(avatar);

  const index = blogpostsArray.findIndex(
    (post) => post.id === req.params.postid
  );
  const oldPost = blogpostsArray[index];
  const updatedPost = {
    ...oldPost,
    ...req.body,
    author: {
      ...oldPost.author,
      name: req.body.author.name,
      avatar: avatar,
    },
    updatedAt: new Date(),
  };
  writeToFile();
  res.status(201).send(updatedPost);
});

postsRouter.delete("/:postid", (req, res) => {
  const remainingPosts = blogpostsArray.filter(
    (post) => post.id !== req.params.postid
  );
  fs.writeFileSync(blogpostsJSONpath, JSON.stringify(remainingPosts));
  res.status(202).send("Post deleted.");
});

export default postsRouter;
