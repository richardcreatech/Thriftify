const { fetchHTML } = require("./fetchHTML");
const cheerio = require("cheerio");

/**
 * HubSpot Blog — blog.hubspot.com
 * Articles live in <div class="blog-post-card"> wrappers
 */
async function scrapeHubSpot() {
  const $ = await fetchHTML("https://blog.hubspot.com/");

  const articles = [];

  // HubSpot uses multiple card patterns — cover them all
  $(".blog-post-card, .post-listing--item, article").each((_, el) => {
    const card = $(el);

    const titleEl = card.find("h2 a, h3 a, .blog-post-card__title a").first();
    const title = titleEl.text().trim();
    const href = titleEl.attr("href") || "";
    const url = href.startsWith("http")
      ? href
      : `https://blog.hubspot.com${href}`;

    const author =
      card
        .find(".blog-post-card__author-name, .author-name, [class*='author']")
        .first()
        .text()
        .trim() || "HubSpot";

    const dateRaw =
      card.find("time").attr("datetime") ||
      card.find(".blog-post-card__date, [class*='date']").first().text().trim();

    const content = card
      .find(".blog-post-card__description, .post-description, p")
      .first()
      .text()
      .trim();

    if (!title) return;

    articles.push({
      title,
      author,
      date: dateRaw ? new Date(dateRaw).toISOString() : null,
      site_name: "HubSpot",
      site_logo:
        "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      content,
      url,
    });
  });

  return articles;
}

module.exports = { scrapeHubSpot };
