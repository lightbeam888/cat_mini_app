import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { bsc } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "f37a44911258a7a7ec9131f91a1b9204";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [bsc];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
