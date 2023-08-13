import { ReactNode, useReducer } from 'react';

import { uiReducer } from '@/state/dashboardReducer';

import { UIContext, UIDispatchContext } from './UIContext';

export function UIProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [state, dispatch] = useReducer(uiReducer, {
    addresses: {},
    erc721s: [],
    erc1155s: [],
    erc20s: [],
    panelsState: {},
  });

  return (
    <UIContext.Provider value={state}>
      <UIDispatchContext.Provider value={dispatch}>
        {children}
      </UIDispatchContext.Provider>
    </UIContext.Provider>
  );
}
