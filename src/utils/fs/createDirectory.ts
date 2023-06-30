import fs from "fs";
import path from "path";

export const createDirectory = (dirname: string) => {
  let dirName = dirname;
  let allUncreatedDirectories = [];
  while(!fs.existsSync(dirName)) {
    allUncreatedDirectories.push(dirName);
    dirName = path.dirname(dirName);
  }
  while(allUncreatedDirectories.length > 0) {
    fs.mkdirSync(allUncreatedDirectories[allUncreatedDirectories.length - 1]);
    allUncreatedDirectories.splice(allUncreatedDirectories.length - 1, 1);
  }
}