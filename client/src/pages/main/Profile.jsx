import React, { useEffect, useState } from "react";
import "../../styles/profile_page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../config/api.js";

function Profile() {
  const [user, setUser] = useState({});
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState("edit");
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    phoneNumber: "",
    country: "",
    image: null,
    otp: "",
  });
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function get_sellers_profile() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/auth/get_seller_profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to retrieve seller profile.");
        }

        const seller = data.seller;

        setUser({
          storeName: seller.display_name,
          username: seller.username,
          bio: seller.bio,
          location: seller.country,
          verified: seller.is_verified,
          avatar: seller.profile_picture_url,
          banner: seller.cover_photo,
          totalProducts: seller.total_products,
          totalSales: seller.total_sales,
          phoneNumber: seller.phone_number,
          marketplaces: seller.marketplace_count,
          bank_details: {
            bank_name: seller.bank_name,
            account_name: seller.account_name,
            account_number: seller.account_number,
          },
          status: seller.status,
        });
      } catch (error) {
        console.error("Get seller profile error:", error);
        setProfileError(error.message || "Failed to retrieve seller profile.");
      }
    }

    get_sellers_profile();
  }, []);

  const openEditor = () => {
    setEditForm({
      username: user.username || "",
      bio: user.bio || "",
      phoneNumber: user.phoneNumber || "",
      country: user.location || "",
      image: null,
      otp: "",
    });
    setEditStep("edit");
    setEditError("");
    setEditMessage("");
    setIsEditing(true);
  };

  const requestVerificationCode = async () => {
    setIsSubmitting(true);
    setEditError("");
    setEditMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/profile/edit/request-verification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Couldn't send a verification code.");
      }

      setEditMessage(data.message);
      setEditStep("verify");
    } catch (error) {
      setEditError(error.message || "Couldn't send a verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestVerification = async (event) => {
    event.preventDefault();
    await requestVerificationCode();
  };

  const handleConfirmEdit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setEditError("");

    try {
      const formData = new FormData();
      formData.append("otp", editForm.otp);
      formData.append("username", editForm.username);
      formData.append("bio", editForm.bio);
      formData.append("phoneNumber", editForm.phoneNumber);
      formData.append("country", editForm.country);
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/profile/edit/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Couldn't update your profile.");
      }

      const seller = data.seller;
      setUser((currentUser) => ({
        ...currentUser,
        username: seller.username,
        bio: seller.bio,
        phoneNumber: seller.phone_number,
        location: seller.country,
        avatar: seller.profile_picture_url,
      }));
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Couldn't update your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="profile_page">
      {profileError && <p className="profile_error">{profileError}</p>}
      <div className="profile_edit_header">
        <h1>My Profile</h1>
        <button type="button" onClick={openEditor}>
          Edit profile
        </button>
      </div>
      <div id="layer_2">
        <article className="my_info">
          <h2>Total Products</h2>
          <h1>{user.totalProducts}</h1>
        </article>

        <article className="my_info">
          <h2>Total Sales</h2>
          <h1>{user.totalSales}</h1>
        </article>

        <article className="my_info">
          <h2>My Markets</h2>
          <h1>{user.marketplaces}</h1>
        </article>
      </div>
      <div id="layer_1">
        <article>
          <img
            src={user.avatar || "https://shorturl.at/KFqta"}
            width={70}
            alt=""
          />
        </article>
        <article className="verified">
          <h2>{user.username}</h2>
          <small>
            {user.verified && <FontAwesomeIcon icon={faShieldHeart} />}{" "}
            {user.storeName}
          </small>
          <p>{user.bio}</p>
        </article>
        <article className="payment_card">
          <div className="atm_card">
            <div className="atm_card__shine" />
            <div className="atm_card__shine atm_card__shine--2" />

            <div className="atm_card__top">
              <span className="atm_card__bank">
                {user?.bank_details?.bank_name}
              </span>
              <div className="atm_card__logo">
                <div className="atm_card__logo_inner" />
              </div>
            </div>

            <div className="atm_card__mid">
              <div className="atm_chip">
                <div className="atm_chip__row" />
                <div className="atm_chip__row atm_chip__row--split">
                  <div className="atm_chip__cell" />
                  <div className="atm_chip__gap" />
                  <div className="atm_chip__cell" />
                </div>
                <div className="atm_chip__row" />
              </div>
              <span className="atm_card__number">
                {user?.bank_details?.account_number}
              </span>
            </div>

            <div className="atm_card__bottom">
              <div>
                <p className="atm_card__holder_label">Card holder</p>
                <p className="atm_card__holder_name">
                  {user?.bank_details?.account_name}
                </p>
              </div>
              {user?.verified && (
                <div className="atm_card__status">
                  <span className="atm_card__status_dot" />
                  <span className="atm_card__status_text">Verified</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {isEditing && (
        <div className="profile_edit_overlay">
          <section
            className="profile_edit_dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile_edit_title"
          >
            <div className="profile_edit_dialog_header">
              <div>
                <h2 id="profile_edit_title">Edit profile</h2>
                <p>
                  {editStep === "edit"
                    ? "Your changes are saved after you verify your email."
                    : "Enter the 6-digit code sent to your account email."}
                </p>
              </div>
              <button
                type="button"
                className="profile_edit_close"
                onClick={() => setIsEditing(false)}
                aria-label="Close profile editor"
              >
                ×
              </button>
            </div>

            {editError && (
              <p className="profile_edit_error" role="alert">
                {editError}
              </p>
            )}
            {editMessage && (
              <p className="profile_edit_message" role="status">
                {editMessage}
              </p>
            )}

            {editStep === "edit" ? (
              <form onSubmit={handleRequestVerification}>
                <label>
                  Username
                  <input
                    type="text"
                    value={editForm.username}
                    maxLength={50}
                    required
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        username: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Bio
                  <textarea
                    value={editForm.bio}
                    maxLength={1000}
                    rows={4}
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        bio: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    maxLength={50}
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        phoneNumber: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Country
                  <input
                    type="text"
                    value={editForm.country}
                    maxLength={100}
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        country: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Profile photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        image: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
                <div className="profile_edit_actions">
                  <button
                    type="button"
                    className="profile_edit_cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Sending code..."
                      : "Continue to verification"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmEdit}>
                <label>
                  Verification code
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={editForm.otp}
                    onChange={(event) =>
                      setEditForm((currentForm) => ({
                        ...currentForm,
                        otp: event.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                  />
                </label>
                <div className="profile_edit_actions">
                  <button
                    type="button"
                    className="profile_edit_cancel"
                    onClick={() => setEditStep("edit")}
                  >
                    Back
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify and save"}
                  </button>
                </div>
                <button
                  type="button"
                  className="profile_edit_resend"
                  onClick={requestVerificationCode}
                  disabled={isSubmitting}
                >
                  Send a new code
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

export default Profile;
