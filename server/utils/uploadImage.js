const crypto = require("crypto");
const { cloudinary } = require("./cloudinary");

const uploadImageToCloudinary = async (file) => {
  if (!file?.buffer?.length) {
    throw new Error("An image file is required for upload.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "thriftify",
        public_id: crypto.randomUUID(),
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary did not return an image URL and public ID."));
          return;
        }

        resolve({ url: result.secure_url, key: result.public_id });
      }
    );

    uploadStream.end(file.buffer);
  });
};

module.exports = { uploadImageToCloudinary };
