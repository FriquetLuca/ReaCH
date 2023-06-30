export const testPerformance = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

export const testPerformanceAsync = async (fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};