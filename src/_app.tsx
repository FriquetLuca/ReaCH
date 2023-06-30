import React from 'react';
import { ReactNode } from 'react';

function App({ children }: { children: ReactNode }) {
  return (<>{children}</>);
}

export default App;