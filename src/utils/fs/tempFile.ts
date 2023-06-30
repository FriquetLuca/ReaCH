import fs from "fs";
export const tempFile = (tempLocation: string, data: string | NodeJS.ArrayBufferView, fn: (src: string) => void) => {
  fs.writeFileSync(tempLocation, data);
  fn(tempLocation);
  fs.rmSync(tempLocation);
};
export const tempFileAsync = async (tempLocation: string, data: string | NodeJS.ArrayBufferView, fn: (src: string) => Promise<void>) => {
  fs.writeFileSync(tempLocation, data);
  await fn(tempLocation);
  fs.rmSync(tempLocation);
};