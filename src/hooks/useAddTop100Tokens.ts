import { Network } from "alchemy-sdk";
import { useContext, useEffect } from "react";
import { Address, mainnet, useNetwork } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

import { UIDispatchContext } from "@/state/UIContext";

export const useAddTop100Tokens = (address: `0x${string}` | undefined) => {
  const { chain } = useNetwork();
  const dispatch = useContext(UIDispatchContext);

  useEffect(() => {
    if (address != null && chain?.id != null) {
      const network = chainIdToAlchemyNetwork(chain?.id);
      const fetchBalances = async () => {
        const result = await fetch(`/api/${address}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ network }),
        });
        const tokensResult = await result.json();
        for (const result of tokensResult) {
          dispatch({
            type: "add-contract-erc20",
            contract: {
              address: result.contractAddress as Address,
              chainId: chain.id,
              symbol: result.symbol,
            },
          });
        }
      };
      fetchBalances();
    }
  }, [address, chain, dispatch]);
};

const chainIdToAlchemyNetwork = (chainId: number | undefined) => {
  switch (chainId) {
    case mainnet.id:
      return Network.ETH_MAINNET;
    case goerli.id:
      return Network.ETH_GOERLI;
    case polygon.id:
      return Network.MATIC_MAINNET;
    case polygonMumbai.id:
      return Network.MATIC_MUMBAI;
    case arbitrum.id:
      return Network.ARB_MAINNET;
    case arbitrumGoerli.id:
      return Network.ARB_GOERLI;
    case optimism.id:
      return Network.OPT_MAINNET;
    case optimismGoerli.id:
      return Network.OPT_GOERLI;
    default:
      return Network.ETH_MAINNET;
  }
};
