import cloudinary from "../config/cloudinary";

export const uploadImages = async (imageFiles: Express.Multer.File[]) => {
  const imageUrls: string[] = [];

  for (const image of imageFiles) {
    const b64 = Buffer.from(image.buffer).toString("base64");

    let dataURI = "data:" + image.mimetype + ";base64," + b64;

    const response = await cloudinary.uploader.upload(dataURI);

    imageUrls.push(response.url);
  }

  return imageUrls;
};

export const uploadSingleImage = async (imageFile: Express.Multer.File) => {
  const b64 = Buffer.from(imageFile.buffer).toString("base64");

  let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

  const response = await cloudinary.uploader.upload(dataURI);

  return response.url;
};

export const deleteImage = async (imageUrlOrId: string) => {
  try {
    const publicId = extractPublicId(imageUrlOrId);

    if (!publicId) {
      console.warn("Invalid Cloudinary reference for deletion:", imageUrlOrId);
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(
        `Cloudinary deletion failed for ${publicId}: ${result.result}`
      );
    }

    if (result.result === "not found") {
      console.warn(`Image not found on Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("Image deletion failed:", error);
    throw error;
  }
};

const extractPublicId = (input: string): string | null => {
  if (!input) return null;

  if (!input.includes("cloudinary") && !input.includes("/")) {
    return input;
  }

  const urlPattern = /\/upload(?:\/v\d+)?\/(?:[^\/]+\/)?([^\/.]+)/;

  const matches = input.match(urlPattern);

  return matches ? matches[1] : null;
};
