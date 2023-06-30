import fs from "fs";
import path from "path";

export const getFilesRecursive = (dir: string, fileList: string[] = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};