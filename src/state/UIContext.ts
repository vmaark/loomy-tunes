import { createContext, Dispatch } from "react";
import { Address } from "wagmi";

import { DashboardAction, UIState } from "@/state/dashboardReducer";

export type TokenId = Address | `${number}-gas-token`;

export const UIContext = createContext<UIState>({
  addresses: {},
  erc20s: [],
  erc721s: [],
  erc1155s: [],
  selectedToken: undefined,
  selectedAddress: undefined,
});

export const UIDispatchContext = createContext<Dispatch<DashboardAction>>(
  undefined!,
);
