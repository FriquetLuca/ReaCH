
export const routerPath = (testedPath: string, routes: string[], stackTrace: number = 0): string|undefined => {
  const stackRoutes = [ ...routes ];
  for(let i = stackRoutes.length - 1; i >= 0; i--) {
    const currentRoute = stackRoutes[i].split("/")[stackTrace];
    const currentTestedRoute = testedPath.split("/")[stackTrace];
    if(currentRoute !== currentTestedRoute) {
      stackRoutes.splice(i, 1);
    }
  }
  return stackRoutes.length > 1 ? routerPath(testedPath, stackRoutes, stackTrace + 1) : stackRoutes.length === 1 ? stackRoutes[0] : undefined;
};