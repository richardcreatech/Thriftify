import React, { useState } from "react";
import showcaseData from "./messages/showcaseData";

function AuthShowcase() {
  const [index, setIndex] = useState(0);

  const current = showcaseData[index];

  return (
    <div
      className="auth-showcase"
      style={{
        backgroundImage: current.image
          ? `linear-gradient(135deg, rgba(39, 44, 86, 0.82), rgba(92, 103, 227, 0.7)), url(${current.image})`
          : undefined,
      }}
    >
      <div className="overlay-content">
        <div className="carousel">
          <div className="carousel-track">
            <h2>{current.title}</h2>
            <p>{current.description}</p>
          </div>
        </div>

        <div className="carousel-dots">
          {showcaseData.map((_, i) => (
            <span
              key={i}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthShowcase;
