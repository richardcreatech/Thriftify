const bcrypt = require("bcryptjs");
const pool = require("../model/db");
const { generateOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendEmail");
const { uploadImageToCloudinary } = require("../utils/uploadImage");

const requestProfileEditVerification = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT email, is_verified
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your account email before editing your profile.",
      });
    }

    const otp = await generateOtp();
    const verificationCode = await bcrypt.hash(otp, 10);
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    await sendEmail(
      user.email,
      "Verify your Thriftify profile update",
      {
        template: "profile-update-verification",
        data: { code: otp.replace("thrift-", "") },
        text: `Your Thriftify profile update verification code is ${otp.replace("thrift-", "")}. It expires in 10 minutes.`,
      }
    );

    await pool.query(
      `UPDATE users
       SET verification_code = $1,
           verification_expires = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [verificationCode, verificationExpires, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "A verification code has been sent to your account email.",
    });
  } catch (error) {
    console.error("Profile edit verification request error:", error);

    return res.status(500).json({
      message: "Couldn't send a verification code. Please try again.",
    });
  }
};

const confirmProfileEdit = async (req, res) => {
  const usernameProvided = Object.prototype.hasOwnProperty.call(
    req.body,
    "username"
  );
  const bioProvided = Object.prototype.hasOwnProperty.call(req.body, "bio");
  const phoneProvided = Object.prototype.hasOwnProperty.call(
    req.body,
    "phoneNumber"
  );
  const countryProvided = Object.prototype.hasOwnProperty.call(
    req.body,
    "country"
  );

  if (
    !usernameProvided &&
    !bioProvided &&
    !phoneProvided &&
    !countryProvided &&
    !req.file
  ) {
    return res.status(400).json({ message: "No profile changes were provided." });
  }

  const username =
    typeof req.body.username === "string"
      ? req.body.username.trim().toLowerCase()
      : "";
  const bio = typeof req.body.bio === "string" ? req.body.bio.trim() : "";
  const phoneNumber =
    typeof req.body.phoneNumber === "string"
      ? req.body.phoneNumber.trim()
      : "";
  const country =
    typeof req.body.country === "string" ? req.body.country.trim() : "";

  if (
    (usernameProvided && (!username || username.length > 50)) ||
    (bioProvided && bio.length > 1000) ||
    (phoneProvided && phoneNumber.length > 50) ||
    (countryProvided && country.length > 100)
  ) {
    return res.status(400).json({
      message: "Please check the profile fields and their length limits.",
    });
  }

  if (
    req.file &&
    !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)
  ) {
    return res.status(400).json({
      message: "Only JPG, PNG and WEBP images are allowed.",
    });
  }

  if (req.file && req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      message: "Profile images must be 5 MB or smaller.",
    });
  }

  const otp = typeof req.body.otp === "string" ? req.body.otp.trim() : "";

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      message: "Please enter a valid 6-digit verification code.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `SELECT verification_code, verification_expires, is_verified
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [req.user.id]
    );
    const user = userResult.rows[0];

    if (!user) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.is_verified) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "Please verify your account email before editing your profile.",
      });
    }

    if (
      !user.verification_code ||
      !user.verification_expires ||
      new Date(user.verification_expires) <= new Date()
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Verification code has expired. Request a new one.",
      });
    }

    const isMatch = await bcrypt.compare(`thrift-${otp}`, user.verification_code);

    if (!isMatch) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    const sellerResult = await client.query(
      `SELECT id, username
       FROM sellers
       WHERE user_id = $1
       FOR UPDATE`,
      [req.user.id]
    );
    const seller = sellerResult.rows[0];

    if (!seller) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Seller profile not found." });
    }

    if (usernameProvided && username !== seller.username) {
      const usernameResult = await client.query(
        "SELECT id FROM sellers WHERE username = $1 AND user_id <> $2",
        [username, req.user.id]
      );

      if (usernameResult.rowCount > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Username already taken." });
      }
    }

    const updates = [];
    const values = [];
    const addUpdate = (column, value) => {
      values.push(value);
      updates.push(`${column} = $${values.length}`);
    };

    if (usernameProvided) addUpdate("username", username);
    if (bioProvided) addUpdate("bio", bio);
    if (phoneProvided) addUpdate("phone_number", phoneNumber);
    if (countryProvided) addUpdate("country", country);

    if (req.file) {
      const image = await uploadImageToCloudinary(req.file);

      if (!image?.url || !image?.key) {
        throw new Error("Profile image upload did not return an image URL.");
      }

      addUpdate("profile_picture_url", image.url);
      addUpdate("profile_picture_key", image.key);
    }

    values.push(seller.id);
    const updatedSeller = await client.query(
      `UPDATE sellers
       SET ${updates.join(", ")},
           updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING username, bio, phone_number, country, profile_picture_url`,
      values
    );

    await client.query(
      `UPDATE users
       SET verification_code = '',
           verification_expires = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [req.user.id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      seller: updatedSeller.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({ message: "Username already taken." });
    }

    console.error("Profile edit confirmation error:", error);

    return res.status(500).json({
      message: "Couldn't update your profile. Please try again.",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  requestProfileEditVerification,
  confirmProfileEdit,
};
