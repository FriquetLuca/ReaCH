export const duplicateString = (source: string, amount: number) => {
  const count = Math.floor(amount);
  
  if(count <= 0) {
    return "";
  }
  
  let result = "";

  for(let i = 0; i < count; i++) {
    result = `${result}${source}`;
  }
  return result;
}