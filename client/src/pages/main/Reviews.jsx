import React from "react";
import ProfileCard from "../../components/ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../../components/ProgressBar";
import "../../styles/reviews.css";

function Reviews() {
  const sampleReviews = [
    {
      id: 1,
      name: "Amara Okafor",
      initials: "AO",
      rating: 5,
      date: "Oct 18, 2026",
      product: "Wireless Headphones",
      comment:
        "The sound quality is really good for the price. The bass is clear, and they're comfortable enough to wear while studying. Delivery was smooth too.",
    },
    {
      id: 2,
      name: "Daniel Yusuf",
      initials: "DY",
      rating: 4,
      date: "Oct 16, 2026",
      product: "Wireless Headphones",
      comment:
        "Good headphones overall, and the battery lasts longer than I expected. I just wish the carrying case felt a little sturdier.",
    },
    {
      id: 3,
      name: "Zara Ibrahim",
      initials: "ZI",
      rating: 3,
      date: "Oct 14, 2026",
      product: "Wireless Headphones",
      comment:
        "They work as expected, but the fit took some getting used to. They're decent for everyday listening.",
    },
    {
      id: 4,
      name: "Michael Adeyemi",
      initials: "MA",
      rating: 5,
      date: "Oct 11, 2026",
      product: "Wireless Headphones",
      comment:
        "Exactly what I needed for online classes. Clear audio, comfortable fit, and no issues connecting to my laptop.",
    },
    {
      id: 5,
      name: "Tomi Bello",
      initials: "TB",
      rating: 2,
      date: "Oct 8, 2026",
      product: "Wireless Headphones",
      comment:
        "The sound is okay, but the connection occasionally drops. I expected a more reliable connection at this price.",
    },
  ];
  return (
    <section id="reviews_pg">
      <header id="reviews_header">
        <ProfileCard />
      </header>

      <main id="reviews_main">
        <section id="my_product">
          <div id="about_product">
            <img
              src="https://i.pinimg.com/736x/e5/93/e2/e593e22bf3d8b68cfcfe71d4a722d1ce.jpg"
              alt=""
            />

            <div id="product_info">
              <h2>Product Name</h2>
              <div id="product_rating">
                <h2 id="product_rating_number">5.0</h2>

                <div id="product-rating-stars">
                  <span>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div id="product_review_btns">
            {/* <button id="delete_reviews">Delete Reviews</button> */}
            <button id="remove_product">Remove Product</button>
          </div>
        </section>

        <section id="review_overview">
          <header id="review_filters">
            <div id="number_rating">
              <label for="rating_number_filter">Sort By:</label>

              <select name="rate_number">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>

            <div id="market_rating">
              <label for="market_filter">Sort By:</label>

              <select name="market_options">
                <option value="comic">Comic</option>
                <option value="video_games">Video Games</option>
                <option value="movie_village">Movie Village`</option>
                <option value="wig_town">Wig Town</option>
              </select>
            </div>
          </header>

          <section id="all_my_reviews">
            {sampleReviews.map((review) => (
              <article className="a_review" key={review.id}>
                <div className="review_giver_info">
                  <div className="review_avatar" aria-hidden="true">
                    {review.initials}
                  </div>

                  <div className="review_author">
                    <p>{review.name}</p>
                    <span>{review.date}</span>
                  </div>
                </div>

                <div
                  className="starRatings"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faThumbsUp}
                      className={
                        index < review.rating ? "star_filled" : "star_empty"
                      }
                    />
                  ))}
                </div>

                <p className="review_comment">{review.comment}</p>

                <div className="review_product">
                  Reviewed product: <strong>{review.product}</strong>
                </div>
              </article>
            ))}
          </section>
        </section>

        <section id="rating_summary">
          <div>
            <h3>Overall Rating</h3>
            <h1>4.2</h1>
            <p>
              <span>10</span> reviews
            </p>
          </div>
          <div>
            <ProgressBar />
          </div>
        </section>
      </main>
    </section>
  );
}

export default Reviews;
