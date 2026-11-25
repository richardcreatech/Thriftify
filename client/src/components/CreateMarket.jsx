import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faImage,
  faUpload,
  faXmark,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

function CreateMarket({ handlePopup, onMarketCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetFunds, setTargetFunds] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        handlePopup();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handlePopup, loading]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PNG, JPG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a marketplace name.");
      return;
    }

    const funds = targetFunds === "" ? 0 : Number(targetFunds);

    if (!Number.isFinite(funds) || funds < 0) {
      setError("Please enter a valid, non-negative funding goal.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in again to create a marketplace.");
      return;
    }

   

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("target_funds", String(funds));
      formData.append("logo", image);

      const response = await fetch("http://localhost:5000/market/make", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create marketplace.");
      }

      await onMarketCreated?.();
      handlePopup();
    } catch (error) {
      console.error("Create marketplace error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="market-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          handlePopup();
        }
      }}
    >
      <section
        className="market-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="market-modal-title"
      >
        <header className="market-modal-header">
          <div className="market-modal-heading">
            <div className="market-modal-icon">
              <FontAwesomeIcon icon={faStore} />
            </div>

            <div>
              <h2 id="market-modal-title">Create a marketplace</h2>
              <p>Build a space for your products and customers.</p>
            </div>
          </div>

          <button
            type="button"
            className="market-modal-close"
            onClick={handlePopup}
            disabled={loading}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <form className="marketplace-form" onSubmit={handleSubmit}>
          <div className="market-form-group">
            <label htmlFor="market-name">
              Marketplace name <span>*</span>
            </label>

            <input
              id="market-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vanilla Finds"
              maxLength={255}
              autoFocus
              required
            />
          </div>

          <div className="market-form-group">
            <label htmlFor="market-description">Description</label>

            <textarea
              id="market-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will people find in your marketplace?"
              maxLength={1000}
              rows={3}
            />

            <span className="market-field-hint">
              Briefly describe what you sell.
            </span>
          </div>

          <div className="market-form-group">
            <label htmlFor="target-funds">
              Target funds <span className="optional-label">Optional</span>
            </label>

            <div className="market-money-input">
              <span>₦</span>
              <input
                id="target-funds"
                type="number"
                min="0"
                step="1"
                value={targetFunds}
                onChange={(e) => setTargetFunds(e.target.value)}
                placeholder="250,000"
              />
            </div>

            <span className="market-field-hint">
              Set a funding goal for your marketplace.
            </span>
          </div>

          <div className="market-form-group">
            <label htmlFor="market-image">
              Cover image
              <span className="optional-label">Optional</span>
            </label>

            <input
              id="market-image"
              className="market-image-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />

            <label
              htmlFor="market-image"
              className={`market-image-upload ${
                imagePreview ? "has-image" : ""
              }`}
            >
              {imagePreview ? (
                <img
                  className="market-image-preview"
                  src={imagePreview}
                  alt="Marketplace cover preview"
                />
              ) : (
                <div className="market-upload-placeholder">
                  <div className="market-upload-icon">
                    <FontAwesomeIcon icon={faImage} />
                  </div>

                  <div className="market-upload-copy">
                    <strong>Upload a cover image</strong>
                    <span>Choose an image from your device</span>
                    <small>PNG, JPG or WEBP · Max 5 MB</small>
                  </div>

                  <FontAwesomeIcon
                    className="market-upload-action"
                    icon={faUpload}
                  />
                </div>
              )}
            </label>

            {imagePreview && (
              <div className="market-image-selected">
                <span>{image.name}</span>

                <button
                  type="button"
                  onClick={() => setImage(null)}
                  aria-label="Remove cover image"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  Remove
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="market-form-error" role="alert">
              {error}
            </div>
          )}

          <footer className="market-modal-footer">
            <button
              type="button"
              className="market-cancel-btn"
              onClick={handlePopup}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="market-create-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="market-spinner" />
                  Creating...
                </>
              ) : (
                "Create marketplace"
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateMarket;
