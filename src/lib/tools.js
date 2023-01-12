import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const postsJSONPath = join(dataFolderPath, "blogPosts.json")

export const getPosts = () => readJSON(postsJSONPath)
export const writePosts = (arr) => writeJSON(postsJSONPath, arr)

export const getJSONReadableStream = () => createReadStream(postsJSONPath)