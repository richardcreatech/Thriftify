import React, { useState } from "react";

function CreateMarket({handlePopup}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetFunds, setTargetFunds] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const marketplace = {
      name,
      description,
      target_funds: Number(targetFunds),
    };

    try {
      const response = await fetch("http://localhost:5000/market/make", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if your route is protected
        },
        body: JSON.stringify(marketplace),
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div class="modal-overlay">
      <div class="marketplace-modal">
        <button class="close-btn" onClick={() => handlePopup()}>&times;</button>

        <h2>Create Marketplace</h2>
        <p>Start selling by creating your own marketplace.</p>

        <form class="marketplace-form" onSubmit={(e) => handleSubmit(e)}>
          <div class="form-group">
            <label>Marketplace Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marketplace Name"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your marketplace..."
            />
          </div>

          <div class="form-group">
            <label>Funding Goal (₦)</label>
            <input
              type="number"
              value={targetFunds}
              onChange={(e) => setTargetFunds(e.target.value)}
              placeholder="500000"
            />
            0
          </div>

          <button type="submit" class="create-btn">
            Create Marketplace
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMarket;
