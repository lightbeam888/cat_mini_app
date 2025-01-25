"use client";
import type { AppProps } from "next/app";
import "../app/globals.css";
import { SnackbarProvider } from "notistack";
import Footer from "@/app/components/Reusable/Footer";
import { persistor, store } from "../redux";
import { useRouter } from "next/router";

import {
  Provider as StoreProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { setTasks, setUser } from "@/redux/reducers/TaskReducer";
import { PersistGate } from "redux-persist/integration/react";
import { setCurrentUser, setUsers } from "@/redux/reducers/UsersReducer";
import { setBuilds, setThings } from "@/redux/reducers/BuildReducer";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { WagmiProvider } from "wagmi";
import { config } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setRate } from "@/redux/reducers/TaskReducer";
import { getUserId } from "@/app/lib/utils";
import ErrorBoundary from "@/app/components/ErrorBoundary/ErrorBoundary";
import instance from "@/app/axios";
import ShareStoryProvider from "@/app/components/ShareStoryProvider/ShareStoryProvider";
import { TonConnectUIProvider, useTonConnectUI } from "@tonconnect/ui-react";

import { wagmiAdapter, projectId } from "@/config";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, type Config } from "wagmi";
import Script from "next/script";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "appkit-example",
  description: "AppKit Example",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

declare const window: any;

const AppWrapper = ({ Component, pageProps }: any) => {
  // get the current url path
  const router = useRouter();
  const path = router.pathname;
  // console.log("path", path);
  // get the query params
  const query = router.query;
  // get the full url with query params
  const url = router.asPath;
  // console.log("url", url);
  // console.log("query", query);
  const dispatch = useDispatch();
  const isLoadedTask = useSelector((x: any) => x.TaskReducer.isLoadedtask);

  const [isMobile, setIsMobile] = useState(false);
  const userFromQuery = (getUserId(url).user as any)?.id;

  useEffect(() => {
    const { userAgent } = window.navigator;
    setIsMobile(userAgent.includes("Mobi"));

    //   const getTasks = async () => {
    //     const { data } = await instance.get(`/tasks/${userFromQuery || "404"}`);
    //     dispatch(setTasks(data));
    //   };
    //   const funcRate = async () => {
    //     const { data } = await instance.get("/rate");
    //     dispatch(setRate(data));
    //   };

    //   const funcUsers = async () => {
    //     const { data } = await instance.get("/users");
    //     dispatch(setUsers(data));
    //   };
    //   const fetchData = async () => {
    //     console.log("userFromQuery", userFromQuery);
    //     if (userFromQuery) {
    //       const { data } = await instance.get("/users");
    //       const item = data.find((item: any) => item.tg_id == userFromQuery);
    //       dispatch(setUser(item.tg_id));
    //       dispatch(setCurrentUser(item));
    //     }
    //   };
    //   const fetch = async () => {
    //     if (userFromQuery) {
    //       const response = await instance.post(`/tgid`, {
    //         user: userFromQuery,
    //       });
    //       dispatch(setCurrentUser(response.data));
    //     }
    //   };
    //   const funcThings = async () => {
    //     const { data } = await instance.get("/things");
    //     dispatch(setThings(data));
    //   };
    //   const funcBuilds = async () => {
    //     const { data } = await instance.get("/builds");
    //     dispatch(setBuilds(data));
    //   };

    //   funcUsers();
    //   funcThings();
    //   funcBuilds();
    //   getTasks();
    //   fetchData();
    //   fetch();
    //   funcRate();
  }, []);

  useEffect(() => {
    const telegram = window?.Telegram?.WebApp;
    telegram?.expand();
    telegram?.disableVerticalSwipes();
  });

  return (
    <>
      {/* {!isLoadedTask ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : isMobile ? (
        <>
          {" "}
          <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
          />
          <Component {...pageProps} />
        </>
      ) : (
        <div className="flex flex-col space-y-5 justify-center items-center fixed top-0 left-0 w-full h-full bg-[#191C73] bg-opacity-20 backdrop-blur-lg z-[2]">
          <img className="max-w-[186px]" src="/images/crying.svg" />
          <span>Not available in PC.</span>
        </div>
      )} */}
      <>
        {" "}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <Component {...pageProps} />
      </>
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
    //   <QueryClientProvider client={queryClient}>
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider>
          <ErrorBoundary>
            <ShareStoryProvider>
              <AppWrapper Component={Component} pageProps={pageProps} />
              <Footer />
            </ShareStoryProvider>
          </ErrorBoundary>
        </SnackbarProvider>
      </PersistGate>
    </StoreProvider>
    //   </QueryClientProvider>
    // </WagmiProvider>
  );
}
