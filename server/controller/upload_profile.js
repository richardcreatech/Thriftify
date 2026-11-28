const pool = require("../model/db");
const { uploadImageToCloudinary } = require("../utils/uploadImage");

const uploadProfilePicture = async (req, res) => {
  try {
    // 1. Find the logged-in user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [req.user.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 2. Find the seller account
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [user.id]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(404).json({
        message: "Seller account not found.",
      });
    }

    // 3. Check that an image was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image.",
      });
    }

    // 4. Validate the image type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, PNG and WEBP images are allowed.",
      });
    }

    // 5. Upload the image to Cloudinary
    const uploadResult = await uploadImageToCloudinary(req.file);

    // 6. Save the Cloudinary URL and public ID in PostgreSQL
    const imageUrl = uploadResult.url;
    const imageKey = uploadResult.key;

    const updatedSeller = await pool.query(
      `UPDATE sellers
       SET profile_picture_url = $1,
           profile_picture_key = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING profile_picture_url, profile_picture_key`,
      [imageUrl, imageKey, seller.id]
    );

    const profilePicture = updatedSeller.rows[0];

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      image: {
        url: profilePicture.profile_picture_url,
        key: profilePicture.profile_picture_key,
      },
    });
  } catch (err) {
    console.error("Profile picture upload error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = { uploadProfilePicture };
