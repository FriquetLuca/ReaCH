export const fileSize = (sizeInBytes: number) => {
  switch(true) {
    case (sizeInBytes >= 1048576) && (sizeInBytes < 1073741824):
      return `${Math.floor((sizeInBytes / 1048576) * 10) / 10} Mb`;
    case (sizeInBytes >= 1024) && (sizeInBytes < 1048576):
      return `${Math.floor((sizeInBytes / 1024) * 10) / 10} kb`;
    case sizeInBytes < 1024:
      return `${sizeInBytes} b`;
  }
  return `${Math.floor((sizeInBytes / 1073741824) * 10) / 10} Gb`;
};