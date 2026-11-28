import React, { useEffect, useRef, useState } from "react";
import "../../../styles/create_process.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api.js";

const avatars = [
  "https://api.dicebear.com/9.x/adventurer/png?seed=Richard",
  "https://api.dicebear.com/9.x/adventurer/png?seed=John",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Emma",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Grace",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Daniel",
  "https://api.dicebear.com/9.x/adventurer/png?seed=Sophia",
];

function Profile_Creation() {
  const [image, setImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access is unavailable. You can still choose an avatar."
      );
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      alert("Your camera isn't ready yet. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      alert("Unable to capture your photo.");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setImage(canvas.toDataURL("image/png"));
    setSelectedAvatar(null);
    stopCamera();
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please capture a photo or choose an avatar.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("onboardingToken");

      if (!token) {
        alert("Your onboarding session has expired. Please register again.");
        navigate("/onboarding/email");
        return;
      }

      // Convert the selected image into a file for the backend.
      const imageResponse = await fetch(image);

      if (!imageResponse.ok) {
        throw new Error("Unable to load the selected image.");
      }

      const blob = await imageResponse.blob();

      const file = new File([blob], "profile.png", {
        type: blob.type || "image/png",
      });

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/auth/pic`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to upload your profile picture.");
        return;
      }

      localStorage.removeItem("onboardingToken");

      alert("Profile picture uploaded successfully!");
      navigate("/signin");
    } catch (err) {
      console.error("Profile picture upload error:", err);
      alert(
        "Unable to upload your image. Please try another image or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="profile_creation_pg">
      <section id="profile_pic_preview">
        {image ? (
          <img src={image} alt="Selected profile preview" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Camera preview"
          />
        )}

        <canvas ref={canvasRef} hidden />

        {!image && (
          <button type="button" id="snap_me" onClick={capturePhoto}>
            Capture
          </button>
        )}

        {cameraError && <p>{cameraError}</p>}
      </section>

      <section id="set_avatar">
        <div>
          <h2>Add a profile photo</h2>
          <p>
            Help buyers recognize and trust your store with a clear profile
            photo.
          </p>
        </div>

        <div id="choose_an_avatar">
          <h3>Choose an avatar</h3>

          <div id="avatar_library">
            {avatars.map((avatar) => (
              <article
                key={avatar}
                className={`an_avatar ${
                  selectedAvatar === avatar ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  setImage(avatar);
                  setCameraError("");
                }}
                role="button"
                tabIndex={0}
                aria-label="Choose this avatar"
                aria-pressed={selectedAvatar === avatar}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedAvatar(avatar);
                    setImage(avatar);
                    setCameraError("");
                  }
                }}
              >
                <img src={avatar} alt="Profile avatar" />
              </article>
            ))}
          </div>
        </div>

        {image && (
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setSelectedAvatar(null);
              setCameraError("");
              startCamera();
            }}
            disabled={loading}
          >
            Choose another photo
          </button>
        )}

        <button
          type="button"
          className="choose_profile_pic"
          onClick={handleUpload}
          disabled={loading || !image}
        >
          {loading ? "Uploading..." : "Continue →"}
        </button>
      </section>
    </section>
  );
}

export default Profile_Creation;