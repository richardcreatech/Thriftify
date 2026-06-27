import { faArrowRight, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../../styles/orders.css";

function Orders() {
  return (
    <section id="order_pg">
      <section id="_dets">
        <h1>Order</h1>
        <p>These are your orders</p>
      </section>
      <section id="current_order">
        <h1>John Doe</h1>
        <span>
          <FontAwesomeIcon icon={faMap} />
          <p>Nigeria</p>
        </span>
        <div></div>
        <button>
          Attend Order <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </section>

      <section id="all_orders">
        <article>
          <div>
            <span>MJ</span>
          </div>
          <div>
            <p>Mary Johnson</p>
            <div>
              <button>Preview</button>
              <button>Take Order</button>
            </div>
          </div>
        </article>
        <article>
          <div>
            <span>MJ</span>
          </div>
          <div>
            <p>Mary Johnson</p>
            <div>
              <button>Preview</button>
              <button>Take Order</button>
            </div>
          </div>
        </article>
        
      </section>
    </section>
  );
}

export default Orders;
