"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadSingleImage = exports.uploadImages = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadImages = async (imageFiles) => {
    const imageUrls = [];
    for (const image of imageFiles) {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const response = await cloudinary_1.default.uploader.upload(dataURI);
        imageUrls.push(response.url);
    }
    return imageUrls;
};
exports.uploadImages = uploadImages;
const uploadSingleImage = async (imageFile) => {
    const b64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
    const response = await cloudinary_1.default.uploader.upload(dataURI);
    return response.url;
};
exports.uploadSingleImage = uploadSingleImage;
const deleteImage = async (imageUrlOrId) => {
    try {
        const publicId = extractPublicId(imageUrlOrId);
        if (!publicId) {
            console.warn("Invalid Cloudinary reference for deletion:", imageUrlOrId);
            return;
        }
        const result = await cloudinary_1.default.uploader.destroy(publicId);
        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Cloudinary deletion failed for ${publicId}: ${result.result}`);
        }
        if (result.result === "not found") {
            console.warn(`Image not found on Cloudinary: ${publicId}`);
        }
    }
    catch (error) {
        console.error("Image deletion failed:", error);
        throw error;
    }
};
exports.deleteImage = deleteImage;
const extractPublicId = (input) => {
    if (!input)
        return null;
    if (!input.includes("cloudinary") && !input.includes("/")) {
        return input;
    }
    const urlPattern = /\/upload(?:\/v\d+)?\/(?:[^\/]+\/)?([^\/.]+)/;
    const matches = input.match(urlPattern);
    return matches ? matches[1] : null;
};
