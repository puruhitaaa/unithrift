import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const uploadRouter = createTRPCRouter({
  // Generate upload signature for Cloudinary
  generateSignature: publicProcedure
    .input(
      z.object({
        folder: z.string().default("unithrift"),
        resourceType: z.enum(["image", "video"]).default("image"),
      }),
    )
    .mutation(async ({ input }) => {
      const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
      const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cloudinary credentials not configured",
        });
      }

      const timestamp = Math.round(new Date().getTime() / 1000);

      // Generate signature using crypto (compatible with Node.js and edge)
      // Cloudinary uses SHA1 for upload signatures
      const crypto = await import("crypto");
      const signature = crypto
        .createHash("sha1")
        .update(
          `folder=${input.folder}&timestamp=${timestamp}${cloudinaryApiSecret}`,
        )
        .digest("hex");

      return {
        cloudName: cloudinaryCloudName,
        apiKey: cloudinaryApiKey,
        timestamp,
        signature,
        folder: input.folder,
        resourceType: input.resourceType,
      };
    }),
});
