"use client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  localhost,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { ThemeProvider } from "@material-tailwind/react";

import { UIProvider } from "@/state/UIProvider";
import { FC, PropsWithChildren } from "react";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, localhost, arbitrumGoerli],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "Loomy Tunes",
  chains,
  projectId: "loomy-tunes",
});

const config = createConfig({
  connectors,
  autoConnect: true,
  publicClient,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={chains}>
            <UIProvider>{children}</UIProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
