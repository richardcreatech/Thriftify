import React from "react";
import ProfileCard from "../../components/ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../../components/ProgressBar";
import "../../styles/reviews.css";

function Reviews() {
  return (
    <section id="reviews_pg">
      <header id="reviews_header">
       
        <ProfileCard />
      </header>

      <main id="reviews_main">
        <section id="my_product">
          <div id="about_product">
            <img src="https://shorturl.at/CGiiF" alt="" />

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
            <button id="delete_reviews">Delete Reviews</button>
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
            <article className="a_review">
              <div className="review_giver_info">
                <img src="" alt="" />
                <p>Persons Name</p>
              </div>

              <div className="starRatings">
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </span>
              </div>

              <p>
                I've been using these headphones for about three weeks now, and
                they've been a pleasant surprise. The audio is crisp, the bass
                is punchy without being overwhelming, and they're comfortable
                enough to wear during long study or work sessions.
              </p>
            </article>

            <article className="a_review">
              <div className="review_giver_info">
                <img src="" alt="" />
                <p>Persons Name</p>
              </div>

              <div className="starRatings">
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </span>
              </div>

              <p>
                I've been using these headphones for about three weeks now, and
                they've been a pleasant surprise. The audio is crisp, the bass
                is punchy without being overwhelming, and they're comfortable
                enough to wear during long study or work sessions.
              </p>
            </article>

            <article className="a_review">
              <div className="review_giver_info">
                <img src="" alt="" />
                <p>Persons Name</p>
              </div>

              <div className="starRatings">
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </span>
              </div>

              <p>
                I've been using these headphones for about three weeks now, and
                they've been a pleasant surprise. The audio is crisp, the bass
                is punchy without being overwhelming, and they're comfortable
                enough to wear during long study or work sessions.
              </p>
            </article>

            <article className="a_review">
              <div className="review_giver_info">
                <img src="" alt="" />
                <p>Persons Name</p>
              </div>

              <div className="starRatings">
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </span>
              </div>

              <p>
                I've been using these headphones for about three weeks now, and
                they've been a pleasant surprise. The audio is crisp, the bass
                is punchy without being overwhelming, and they're comfortable
                enough to wear during long study or work sessions.
              </p>
            </article>

            <article className="a_review">
              <div className="review_giver_info">
                <img src="" alt="" />
                <p>Persons Name</p>
              </div>

              <div className="starRatings">
                <span>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </span>
              </div>

              <p>
                I've been using these headphones for about three weeks now, and
                they've been a pleasant surprise. The audio is crisp, the bass
                is punchy without being overwhelming, and they're comfortable
                enough to wear during long study or work sessions.
              </p>
            </article>
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
