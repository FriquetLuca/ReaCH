import fs from "fs";
import path from "path";
import { createDirectory } from "./createDirectory";

export const createFile = (filename: string, data: string | NodeJS.ArrayBufferView) => {
  createDirectory(path.dirname(filename));
  fs.writeFileSync(filename, data);
}