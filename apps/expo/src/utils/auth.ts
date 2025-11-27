import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "./base-url";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: "unithrift", // Must match app.config.ts scheme and server trustedOrigins
      storagePrefix: "expo",
      storage: SecureStore,
    }),
  ],
});
