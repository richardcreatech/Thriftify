import {
  faBookBookmark,
  faEdit,
  faMinus,
  faPlus,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard";
import "../../styles/products.css";
import CreateProductModal from "../../components/CreateProductModal";

const categories_box = [
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

function SingleMarket() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { id } = useParams();
  const [market, setMarket] = useState([]);
  const categories = [
    "All",
    ...new Set(market?.products?.map((product) => product.category)),
  ];
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState("");
  const filteredProducts =
    selectedCategory === "All"
      ? market?.products
      : market?.products?.filter(
          (product) => product.category === selectedCategory,
        );

  const handleEditProduct = (product) => {
    setSelectedProduct(product);

    setName(product.name + "l");
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategory(product.category);

    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/create_market/${id}`,
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
      setMarket(data.market);

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

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/delete_product/${id}/product/${productToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Remove product from state
      setMarket(data.market);

      setShowDeleteModal(false);
      setProductToDelete(null);

      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/edit_product/${id}/product/${selectedProduct._id}`,
        {
          method: "PATCH",
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
      setMarket(data.market);
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Update the edited product inside the market state
      setMarket((prev) => ({
        ...prev,
        products: prev.products.map((product) =>
          product._id === data.product._id ? data.product : product,
        ),
      }));

      // Close the modal
      setShowEditModal(false);
      setSelectedProduct(null);

      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/market/market_info/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Market not found or error fetching");
        }
        const data = await response.json();
        console.log(data);
        setMarket(data.market);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMarket();
  }, []);
  console.log(market);

  return (
    <main id="single_market_id">
      <header>
        <div className="my_search">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" />
        </div>

        <FontAwesomeIcon
          icon={faPlus}
          onClick={() => setShowCreateProduct(true)}
          style={{ cursor: "pointer" }}
        />
      </header>
      {/* <section id="banner">
        <div>
          <h3>Market Name</h3>
          <p>
            Shop smarter, save more, and find exactly what you need all from a
            marketplace built with convenience and trust at its core.
          </p>
          <div id="specic_market_ctrls">
            <button id="delete_market">Delete Market</button>
            <button id="edit_market">Edit Market</button>
          </div>
        </div>
      </section> */}
      {/* {id} */}

      {/* <CreateProductModal
        isOpen={showCreateProduct}
        onClose={() => setShowCreateProduct(false)}
        marketId={id}
      /> */}
      {showCreateProduct && (
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
                {categories_box.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      category === item
                        ? "category_pill active"
                        : "category_pill"
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
      )}

      {showEditModal && (
        <div className="modal_overlay">
          <div className="edit_product_modal">
            <button
              className="close_modal"
              onClick={() => setShowEditModal(false)}
            >
              ✕
            </button>

            {/* LEFT SIDE */}
            <section className="product_preview">
              <div className="preview_img">
                <img src={selectedProduct?.imageURL} alt={name} />
              </div>

              <div className="preview_details">
                <h2>{name}</h2>

                <h3>₦{price}</h3>

                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>

                <span className="preview_category">{category}</span>
              </div>
            </section>

            {/* RIGHT SIDE */}
            <section className="edit_panel">
              <div className="edit_headers">
                <h3
                  className={activeTab === "details" ? "active_tab" : ""}
                  onClick={() => setActiveTab("details")}
                >
                  Edit Product Details
                </h3>

                <h3
                  className={activeTab === "image" ? "active_tab" : ""}
                  onClick={() => setActiveTab("image")}
                >
                  Edit Image
                </h3>
              </div>

              {activeTab === "details" && (
                <div className="details_section">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label>Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />

                  <label>Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />

                  <label>Category</label>

                  <div className="category_pills">
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={
                          category === item
                            ? "category_pill active"
                            : "category_pill"
                        }
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleEditSubmit} className="save_changes">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === "image" && (
                <div className="image_section">
                  <div className="image_upload_box">
                    <input type="file" accept="image/*" />

                    <p>Choose an image to preview it.</p>
                  </div>

                  <button disabled>Update Image (Coming Soon)</button>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal_overlay">
          <div className="delete_modal">
            <h2>Delete Product?</h2>

            <p>
              Are you sure you want to delete
              <strong> {productToDelete?.name}</strong>?
            </p>

            <div className="delete_buttons">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>

              <button className="delete_btn" onClick={handleDeleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="display_my_products">
        <h1>My Products</h1>
        <ul id="product_categories">
          {categories.map((category) => (
            <li
              key={category}
              className={selectedCategory === category ? "active_category" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>

        {console.log(market.products)}
        <section id="all_my_products">
          {filteredProducts?.map((i) => (
            <article key={i._id} className="my_product">
              <img src={i.imageURL} alt={i.name} />

              <h3 className="product_name">{i.name}</h3>

              <h2 className="product_price">₦{i.price.toLocaleString()}</h2>

              <div>
                <button
                  onClick={() => handleEditProduct(i)}
                  className="incr_no_of_prod"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                <button
                  className="red_no_of_prod"
                  onClick={() => {
                    setProductToDelete(i);
                    setShowDeleteModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default SingleMarket;
