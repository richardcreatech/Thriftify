const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./a3-credentials");
const crypto = require("crypto");
require("dotenv").config();
// const = require("./")

const uploadImageToS3 = async (file) => {
  try {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) {
      return;
    }

    let url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return { url, key: params.Key };
  } catch (err) {
    console.error(err);
  }
};

module.exports = { uploadImageToS3 };