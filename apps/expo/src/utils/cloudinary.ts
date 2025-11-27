import { trpc } from "./api";

interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video";
}

export async function uploadToCloudinary(
  uri: string,
  type: "image" | "video",
): Promise<CloudinaryUploadResult> {
  try {
    // Get signature from server
    const signatureData = await trpc.upload.generateSignature.mutate({
      folder: "unithrift",
      resourceType: type,
    });

    // Fetch the file from the local URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create form data with signature
    const formData = new FormData();
    formData.append("file", blob as never, "upload");
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    // Upload to Cloudinary with signature
    const resourceType = type === "video" ? "video" : "image";
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Cloudinary upload error:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const data = (await uploadResponse.json()) as {
      public_id: string;
      secure_url: string;
      resource_type: string;
    };

    return {
      publicId: data.public_id,
      secureUrl: data.secure_url,
      resourceType: type,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(
      `Failed to upload ${type}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
