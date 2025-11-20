import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@unithrift/eslint-config/base";
import { nextjsConfig } from "@unithrift/eslint-config/nextjs";
import { reactConfig } from "@unithrift/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
