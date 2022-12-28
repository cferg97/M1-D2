import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/index.js";
import postsRouter from "./posts/index.js";
import filesRouter from "./files/index.js";
import { coverUploadRouter } from "./files/index.js";
import cors from "cors";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandler.js";
import { join } from "path";

const server = express();
const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogposts", postsRouter);
server.use("/blogposts/uploadCover", coverUploadRouter);
server.use("/authors/uploadAvatar", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
