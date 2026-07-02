import React from "react";
import "../../styles/product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/prod.css";

function Product() {
  return (
    <section id="product_pg">
      <section id="prod_categorizes">
        <h3>Categories</h3>

        <ul>
          <li className="active">All Products</li>
          <li>Clothing</li>
          <li>Shoes</li>
          <li>Electronics</li>
          <li>Accessories</li>
          <li>Beauty</li>
          <li>Home</li>
        </ul>
      </section>
      <section id="prod_content">
        <header id="prod_pg_desc">
          <h2>Product Description</h2>
          <span id="about_prod_pg">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search Product" />
          </span>
        </header>

        <section id="my_products">
          <article className="prod_card">
            <div>
              <img src="product-image.jpg" alt="Product Image" />
              <FontAwesomeIcon icon={faPlus} className="add_a_product" />
            </div>
            <span className="price">$99.99</span>
            <h3>Product Name</h3>
            <p>Product Description</p>
          </article>
          <article className="prod_card">
            <div>
              <img src="product-image.jpg" alt="Product Image" />
              <FontAwesomeIcon icon={faPlus} className="add_a_product" />
            </div>
            <span className="price">$99.99</span>
            <h3>Product Name</h3>
            <p>Product Description</p>
          </article>
          <article className="prod_card">
            <div>
              <img src="product-image.jpg" alt="Product Image" />
              <FontAwesomeIcon icon={faPlus} className="add_a_product" />
            </div>
            <span className="price">$99.99</span>
            <h3>Product Name</h3>
            <p>Product Description</p>
          </article>
          <article className="prod_card">
            <div>
              <img src="product-image.jpg" alt="Product Image" />
              <FontAwesomeIcon icon={faPlus} className="add_a_product" />
            </div>
            <span className="price">$99.99</span>
            <h3>Product Name</h3>
            <p>Product Description</p>
          </article>
        </section>
      </section>
    </section>
  );
}

export default Product;
