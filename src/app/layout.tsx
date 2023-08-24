import { FC, PropsWithChildren } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import "@/styles/colors.css";
import { ConfigProvider } from "@/state/ConfigProvider";
import Header from "@/components/layout/Header";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <Header />
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
