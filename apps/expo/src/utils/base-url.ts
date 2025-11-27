// import Constants from "expo-constants"; // Only needed for localhost development

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  /**
   * For OAuth to work properly, we need to use the production URL.
   *
   * If you want to test against localhost during development:
   * 1. Uncomment the localhost logic below
   * 2. Make sure your backend is running on localhost:3000
   * 3. Update Google OAuth console to include http://localhost:3000/api/auth/callback/google
   */

  // Use production URL for OAuth flows
  return "https://unithrift-nextjs.vercel.app";

  // Uncomment for local development (requires backend running on localhost:3000)
  // const debuggerHost = Constants.expoConfig?.hostUri;
  // const localhost = debuggerHost?.split(":")[0];
  // if (!localhost) {
  //   throw new Error("Failed to get localhost. Please point to your production server.");
  // }
  // return `http://${localhost}:3000`;
};
