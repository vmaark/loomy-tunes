import { Address, Chain } from "wagmi";

type Contract = { address: Address; symbol: string; chainId: Chain["id"] };

export type UIState = {
  addresses: Record<Address, string>;
  erc20s: Contract[];
  erc721s: Contract[];
  erc1155s: Contract[];
  selectedToken: Address | undefined;
  selectedAddress: Address | undefined;
};

export const uiReducer = (state: UIState, action: DashboardAction): UIState => {
  switch (action.type) {
    case "select-token": {
      return {
        ...state,
        selectedToken: action.address,
      };
    }
    case "add-address": {
      return {
        ...state,
        addresses: {
          [action.address]: action.label,
          ...state.addresses,
        },
      };
    }
    case "select-address": {
      return {
        ...state,
        selectedAddress: action.address,
      };
    }
    case "remove-address": {
      const { [action.address]: _, ...addresses } = state.addresses;
      return {
        ...state,
        addresses,
      };
    }
    case "set-address-name": {
      return {
        ...state,
        addresses: {
          ...state.addresses,
          [action.address]: action.label,
        },
      };
    }
    case "set-erc20-symbol": {
      const contractIndex = state.erc20s.findIndex(
        (c) => c.address === action.address,
      );
      const contract = state.erc20s[contractIndex];
      contract.symbol = action.symbol;
      return {
        ...state,
        erc20s: [],
      };
    }
    case "add-contract-erc20": {
      return {
        ...state,
        erc20s: [
          ...new Map(
            [...state.erc20s, action.contract].map((c) => [c.address, c]),
          ).values(),
        ],
      };
    }
    case "add-contract-erc721": {
      return {
        ...state,
        erc721s: [
          ...new Map(
            [...state.erc721s, action.contract].map((c) => [c.address, c]),
          ).values(),
        ],
      };
    }
    case "add-contract-erc1155": {
      return {
        ...state,
        erc1155s: [
          ...new Map(
            [...state.erc1155s, action.contract].map((c) => [c.address, c]),
          ).values(),
        ],
      };
    }
    case "remove-contract-erc20": {
      return state;
    }
    case "remove-contract-erc721": {
      return state;
    }
    case "remove-contract-erc1155": {
      return state;
    }
  }
};

export type DashboardAction =
  | {
      type: "select-token";
      address: Address | undefined;
    }
  | {
      type: "add-address";
      address: Address;
      label: string;
    }
  | {
      type: "remove-address";
      address: Address;
    }
  | {
      type: "set-address-name";
      address: Address;
      label: string;
    }
  | {
      type: "select-address";
      address: Address;
    }
  | {
      type: "set-erc20-symbol";
      address: Address;
      symbol: string;
    }
  | {
      type: "add-contract-erc721";
      contract: Contract;
    }
  | {
      type: "add-contract-erc1155";
      contract: Contract;
    }
  | {
      type: "add-contract-erc20";
      contract: Contract;
    }
  | {
      type: "remove-contract-erc721";
      contract: Contract;
    }
  | {
      type: "remove-contract-erc1155";
      contract: Contract;
    }
  | {
      type: "remove-contract-erc20";
      contract: Contract;
    };
