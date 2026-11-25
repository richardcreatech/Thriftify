import {
  faEdit,
  faPlus,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import market_icon from "../../assets/market_icon.png";
import "../../styles/products.css";
// import CreateProductModal from "../../components/CreateProductModal";

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

const getProductImage = (product) =>
  product?.images?.find((image) => image.is_primary)?.image_url ??
  product?.images?.[0]?.image_url ??
  market_icon;

function SingleMarket() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const marketProducts = market?.products ?? [];
  const productCategories = [
    ...new Set(
      marketProducts
        .map((product) => product.category)
        .filter((productCategory) => Boolean(productCategory)),
    ),
  ];
  const categories = [
    "All",
    ...productCategories,
  ];
  const editCategories = [...new Set([...categories_box, ...productCategories])];
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const availableProducts = marketProducts.filter(
    (product) => Number(product.quantity) > 0,
  );
  const outOfStockProducts = marketProducts.filter(
    (product) => !(Number(product.quantity) > 0),
  );
  const filteredProducts = marketProducts
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());
      const isAvailable = Number(product.quantity) > 0;
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && isAvailable) ||
        (availabilityFilter === "out" && !isAvailable);

      return matchesCategory && matchesSearch && matchesAvailability;
    })
    .sort((first, second) => {
      if (sortBy === "price-low" || sortBy === "price-high") {
        const difference = Number(first.price) - Number(second.price);
        return sortBy === "price-low" ? difference : -difference;
      }

      if (sortBy === "stock-low" || sortBy === "stock-high") {
        const difference = Number(first.quantity) - Number(second.quantity);
        return sortBy === "stock-low" ? difference : -difference;
      }

      const difference = (first.name ?? "").localeCompare(second.name ?? "");
      return sortBy === "name-desc" ? -difference : difference;
    });

  const [showProductDrawer, setShowProductDrawer] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const openProductDrawer = (product) => {
    setViewProduct(product);
    setShowProductDrawer(true);
  };

  const closeProductDrawer = () => {
    setShowProductDrawer(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    URL.revokeObjectURL(imagePreview);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setName(product.name ?? "");
    setDescription(product.description ?? "");
    setPrice(String(product.price ?? ""));
    setQuantity(String(product.quantity ?? ""));
    setCategory(product.category ?? "");
    setCondition(product.condition ?? "");

    setImageFile(null);
    setImagePreview(null);
    setActiveTab("details");
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!imageFile) {
        throw new Error("Please select a product image.");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("image", imageFile);

      const response = await fetch(
        `http://localhost:5000/market/create_market/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      setMarket((prev) => ({
        ...prev,
        products: data.products,
      }));

      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setDescription("");
      setCondition("");
      setImageFile(null);
      setImagePreview(null);
      setShowCreateProduct(false);

      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete?.id || !id) {
      console.error("Missing marketplace ID or product ID.", {
        marketId: id,
        productId: productToDelete?.id,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/delete_product/${id}/product/${productToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log("Delete response:", data);
      console.log("Updated products:", data.products);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product.");
      }

      // Replace the displayed products with the updated database result.
      setMarket((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          products: data.products,
        };
      });

      setShowDeleteModal(false);
      setProductToDelete(null);

      console.log(data.message);
    } catch (err) {
      console.error("Delete product error:", err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/market/edit_product/${id}/product/${selectedProduct.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            quantity: Number(quantity),
            category,
            condition,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product.");
      }

      setMarket((prev) => ({
        ...prev,
        products: prev.products.map((product) =>
          product.id === data.product.id ? data.product : product,
        ),
      }));

      setShowEditModal(false);
      setSelectedProduct(null);
      setImageFile(null);
      setImagePreview(null);

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
  }, [id]);
  console.log(market);

  return (
    <section id="single_market_id">
      <header className="products_page_header">
        <div>
          <p className="products_eyebrow">
            INVENTORY{market?.name ? ` / ${market.name}` : ""}
          </p>
          <h1>Products</h1>
          <p className="products_subtitle">
            Manage your marketplace inventory.
          </p>
        </div>
        <button
          type="button"
          className="add_product_button"
          onClick={() => setShowCreateProduct(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Product</span>
        </button>
      </header>

      <section className="inventory_overview" aria-label="Inventory overview">
        <article className="inventory_metric">
          <span>Total products</span>
          <strong>{marketProducts.length}</strong>
        </article>
        <article className="inventory_metric">
          <span>Available</span>
          <strong>{availableProducts.length}</strong>
        </article>
        <article className="inventory_metric">
          <span>Out of stock</span>
          <strong>{outOfStockProducts.length}</strong>
        </article>
      </section>

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

              {/* Uploading Or Previewing Images */}
              {/* This part handles file uploads */}
              <label htmlFor="">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="image_preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "180px",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}

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

              <textarea
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Product Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>

              <button className="submit_product">Create Product</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal_overlay">
          <div
            className="edit_product_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit_product_title"
          >
            <button
              type="button"
              className="close_modal"
              onClick={() => setShowEditModal(false)}
              aria-label="Close edit product dialog"
            >
              ✕
            </button>

            {/* LEFT SIDE */}
            <section className="product_preview">
              <div className="preview_img">
                {/* <img src={selectedProduct?.imageURL} alt={name} /> */}

                <img
                  src={getProductImage(selectedProduct)}
                  alt={name}
                />
              </div>

              <div className="preview_details">
                <h2 id="edit_product_title">{name || "Edit product"}</h2>

                <h3>₦{price}</h3>

                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>

                <span className="preview_category">{category}</span>
              </div>
            </section>

            {/* RIGHT SIDE */}
            <section className="edit_panel">
              <div className="edit_headers" role="tablist" aria-label="Edit product">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "details"}
                  className={activeTab === "details" ? "active_tab" : ""}
                  onClick={() => setActiveTab("details")}
                >
                  Edit Product Details
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "image"}
                  className={activeTab === "image" ? "active_tab" : ""}
                  onClick={() => setActiveTab("image")}
                >
                  Edit Image
                </button>
              </div>

              {activeTab === "details" && (
                <div className="details_section" role="tabpanel">
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

                  <label>Product Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                  />

                  <label>Product Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>

                  <label>Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />

                  <label>Category</label>

                  <div className="category_pills">
                    {editCategories.map((item) => (
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
                <div className="image_section" role="tabpanel">
                  <div className="image_upload_box">
                    <div className="image_upload_box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      <p>
                        {imageFile
                          ? imageFile.name
                          : "Choose a new image for this product."}
                      </p>

                      <img
                        src={imagePreview ?? getProductImage(selectedProduct)}
                        alt={name}
                        className="edit_image_preview"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!imageFile}
                      onClick={() => {
                        // We'll connect this to the image-update endpoint.
                      }}
                    >
                      Update Image
                    </button>

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
          <div
            className="delete_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete_product_title"
            aria-describedby="delete_product_description"
          >
            <div className="delete_modal_icon" aria-hidden="true">
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <h2 id="delete_product_title">Delete product?</h2>

            <p id="delete_product_description">
              Are you sure you want to delete
              <strong> {productToDelete?.name}</strong>?
              <span className="delete_warning">
                This action cannot be undone.
              </span>
            </p>

            <div className="delete_buttons">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete_btn"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="display_my_products">
        <div className="products_section_heading">
          <div>
            <h2>All products</h2>
            <p>{filteredProducts.length} products shown</p>
          </div>
        </div>

        <div className="product_toolbar">
          <label className="my_search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="search"
              placeholder="Search by product name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products by name"
            />
          </label>

          <label className="product_select_label">
            <span>Availability</span>
            <select
              value={availabilityFilter}
              onChange={(event) => setAvailabilityFilter(event.target.value)}
              aria-label="Filter by availability"
            >
              <option value="all">All products</option>
              <option value="available">Available</option>
              <option value="out">Out of stock</option>
            </select>
          </label>

          <label className="product_select_label">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="name">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="stock-high">Stock: high to low</option>
              <option value="stock-low">Stock: low to high</option>
            </select>
          </label>
        </div>

        <div className="product_category_filters" role="group" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={selectedCategory === category ? "active_category" : ""}
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section id="all_my_products">
          {filteredProducts?.map((i) => (
            <article key={i.id} className="my_product">
              <button
                type="button"
                className="product_image_button"
                onClick={() => openProductDrawer(i)}
                aria-label={`View details for ${i.name}`}
              >
                <img
                  src={getProductImage(i)}
                  alt=""
                />
              </button>

              <h3 className="product_name">{i.name}</h3>

              <p className="product_price">
                ₦{Number(i.price).toLocaleString("en-NG")}
              </p>

              <div className="product_meta">
                <span className="product_category">
                  {i.category || "Uncategorised"}
                </span>
                <span
                  className={`product_availability ${
                    Number(i.quantity) > 0 ? "available" : "out_of_stock"
                  }`}
                >
                  {Number(i.quantity) > 0 ? "Available" : "Out of stock"}
                </span>
              </div>

              <p className="product_stock">
                Stock <strong>{i.quantity ?? 0}</strong>
              </p>

              <div className="product_actions">
                <button
                  type="button"
                  onClick={() => handleEditProduct(i)}
                  className="product_edit_action"
                  title={`Edit ${i.name}`}
                  aria-label={`Edit ${i.name}`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  className="product_delete_action"
                  onClick={() => {
                    setProductToDelete(i);
                    setShowDeleteModal(true);
                  }}
                  title={`Delete ${i.name}`}
                  aria-label={`Delete ${i.name}`}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </article>
          ))}
          {!filteredProducts.length && (
            <p className="products_empty_state">
              {marketProducts.length
                ? "No products match your filters."
                : "No products yet. Add a product to stock this marketplace."}
            </p>
          )}
        </section>
      </section>
      {showProductDrawer && viewProduct && (
        <div className="product_drawer_overlay" onClick={closeProductDrawer}>
          <aside
            className="product_drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer_product_name"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="product_drawer_header">
              <span>PRODUCT DETAILS</span>

              <button
                type="button"
                className="drawer_close"
                onClick={closeProductDrawer}
                aria-label="Close product details"
              >
                &times;
              </button>
            </header>

            <div className="product_drawer_content">
              <div className="drawer_product_image">
                <img
                  src={getProductImage(viewProduct)}
                  alt={viewProduct.name}
                />
              </div>

              <div className="drawer_product_info">
                <span className="drawer_category">
                  {viewProduct.category || "Uncategorised"}
                </span>

                <h2 id="drawer_product_name">{viewProduct.name}</h2>

                <p className="drawer_price">
                  ₦{Number(viewProduct.price).toLocaleString("en-NG")}
                </p>

                <div className="drawer_divider" />

                <div className="drawer_field">
                  <span>Available quantity</span>
                  <strong>{viewProduct.quantity ?? "—"}</strong>
                </div>

                <div className="drawer_field">
                  <span>Condition</span>
                  <strong>{viewProduct.condition || "—"}</strong>
                </div>

                <div className="drawer_description">
                  <h3>Description</h3>

                  <p>
                    {viewProduct.description ||
                      "No description has been added for this product."}
                  </p>
                </div>
              </div>
            </div>

            <footer className="product_drawer_footer">
              <button
                type="button"
                className="drawer_edit_button"
                onClick={() => {
                  closeProductDrawer();
                  handleEditProduct(viewProduct);
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit product
              </button>

              <button
                type="button"
                className="drawer_done_button"
                onClick={closeProductDrawer}
              >
                Done
              </button>
            </footer>
          </aside>
        </div>
      )}
    </section>
  );
}

export default SingleMarket;
