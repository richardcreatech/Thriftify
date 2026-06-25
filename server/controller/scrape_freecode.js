const { fetchHTML } = require("./fetchHTML");
const cheerio = require("cheerio");

async function scrapeFreeCodeCamp() {
  const $ = await fetchHTML("https://www.freecodecamp.org/news/");

  const articles = [];

  $("article.post-card").each((_, el) => {
    const card = $(el);

    const title = card.find(".post-card-title").text().trim();
    const href = card.find("a.post-card-image-link").attr("href") || "";
    const url = href.startsWith("http")
      ? href
      : `https://www.freecodecamp.org${href}`;

    const author = card.find(".post-card-meta-link").first().text().trim();
    const date = card.find("time").attr("datetime") || "";

    // Excerpt / content preview
    const content = card.find(".post-card-excerpt").text().trim();

    if (!title) return; // skip empties

    articles.push({
      title,
      author: author || "freeCodeCamp",
      date: date ? new Date(date).toISOString() : null,
      site_name: "freeCodeCamp",
      site_logo: "https://cdn.freecodecamp.org/universal/favicons/favicon.ico",
      content,
      url,
    });
  });

  return articles;
}

module.exports = { scrapeFreeCodeCamp };
