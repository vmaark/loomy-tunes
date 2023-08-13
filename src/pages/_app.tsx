import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
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

import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import "@/styles/colors.css";
import { ThemeProvider } from "@material-tailwind/react";

import { UIProvider } from "@/state/UIProvider";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, localhost, arbitrumGoerli],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
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
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={chains}>
            <UIProvider>
              <Component {...pageProps} />
            </UIProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
