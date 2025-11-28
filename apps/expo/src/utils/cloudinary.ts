import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { useMutation } from "@tanstack/react-query";
import { upload } from "cloudinary-react-native";

import { trpc } from "./api";

interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video";
  width: number;
  height: number;
  format: string;
}

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Uploads a file to Cloudinary using the official React Native SDK with signed upload.
 * This is the most secure way to upload files from mobile apps.
 */
export async function uploadToCloudinary(
  uri: string,
  type: "image" | "video",
  signatureData: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  },
): Promise<CloudinaryUploadResult> {
  try {
    // Initialize Cloudinary instance
    const cld = new Cloudinary({
      cloud: {
        cloudName: signatureData.cloudName,
        apiKey: signatureData.apiKey,
      },
      url: {
        secure: true,
      },
    });

    // Upload options with signature for signed upload
    // For signed uploads, api_key must be included in the options
    const options = {
      folder: signatureData.folder,
      timestamp: signatureData.timestamp,
      signature: signatureData.signature,
      api_key: signatureData.apiKey,
      resource_type: type,
    };

    // Upload using the official SDK
    const response = await new Promise<CloudinaryResponse>(
      (resolve, reject) => {
        void upload(cld, {
          file: uri,
          options: options,
          callback: (error: unknown, result: unknown) => {
            if (error) {
              reject(
                error instanceof Error ? error : new Error("Upload failed"),
              );
            } else {
              resolve(result as CloudinaryResponse);
            }
          },
        });
      },
    );

    return {
      publicId: response.public_id,
      secureUrl: response.secure_url,
      resourceType: type,
      width: response.width,
      height: response.height,
      format: response.format,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(
      `Failed to upload ${type}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Hook to handle the entire signed upload process
 */
export function useCloudinaryUpload() {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const generateSignature = useMutation(
    trpc.upload.generateSignature.mutationOptions(),
  );

  const upload = async (uri: string, type: "image" | "video" = "image") => {
    try {
      setIsPending(true);
      setError(null);

      // 1. Generate signature from backend
      const signatureData = await generateSignature.mutateAsync({
        resourceType: type,
      });

      // 2. Upload with signature using official SDK
      const result = await uploadToCloudinary(uri, type, signatureData);

      setIsPending(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      setError(error);
      setIsPending(false);
      throw error;
    }
  };

  return {
    upload,
    isPending,
    error,
  };
}
