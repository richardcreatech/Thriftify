import { useState } from "react";

const categories = [
  "Electronics",
  "Fashion",
  "Food",
  "Beauty",
  "Sports",
  "Books",
  "Furniture",
  "Health",
  "Gaming",
  "Other",
];

function CreateProductModal({ isOpen, onClose, marketId }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/create_market/${marketId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            price: Number(price),
            quantity: Number(quantity),
            category,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Clear form
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");

      onClose();

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal_overlay">
      <div className="create_product_modal">
        <div className="modal_header">
          <h2>Create Product</h2>

          <button onClick={() => setShowCreateProduct(false)}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price (₦)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <h4>Select Category</h4>

          <div className="category_pills">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={
                  category === item ? "category_pill active" : "category_pill"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="submit_product">Create Product</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProductModal;
