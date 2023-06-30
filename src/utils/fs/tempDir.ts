import fs from "fs";
export const tempDir = (tempLocation: string, fn: (src: string) => void) => {
  fs.mkdirSync(tempLocation);
  fn(tempLocation);
  fs.rmdirSync(tempLocation);
};
export const tempDirAsync = async (tempLocation: string, fn: (src: string) => Promise<void>) => {
  fs.mkdirSync(tempLocation);
  await fn(tempLocation);
  fs.rmdirSync(tempLocation);
};