import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const authorsRouter = express.Router();

authorsRouter.post("/", (req, res) => {
  const newAuthor = {
    ...req.body,
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    createdAt: new Date(),
  };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const email = req.body.email;

  let results = authorsArray.find((i) => i.email === email);

  if (!results) {
    authorsArray.push(newAuthor);
    fs.writeFileSync(authorsJSONpath, JSON.stringify(authorsArray));
    res.status(201).send({ id: newAuthor.id });
  } else {
    res.send("Email is in use, cannot add author.");
  }
});

authorsRouter.post("/checkEmail", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const email = req.body.email;

  let results = authorsArray.find((i) => i.email === email);

  if (results === undefined || null) {
    res.send("Email is free.");
  } else if (results) {
    res.send("Email is in use.");
  }
});

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONpath);
  const authors = JSON.parse(fileContent);
  res.send(authors);
});

authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const foundAuthor = authorsArray.find((user) => user.id === authorId);
  res.send(foundAuthor);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authorsArray[index];

  const updatedAuthor = {
    ...oldAuthor,
    ...req.body,
    updatedAt: new Date(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  authorsArray[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONpath, JSON.stringify(authorsArray));
  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONpath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONpath, JSON.stringify(remainingAuthors));

  res.status(204).send("Deleted.");
});

export default authorsRouter;
