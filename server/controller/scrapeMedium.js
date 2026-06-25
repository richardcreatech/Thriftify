const { fetchHTML } = require("./fetchHTML");
const axios = require("axios");
const { HEADERS } = require("../config/headers");
const cheerio = require("cheerio");

/**
 * Medium — medium.com
 * Medium is heavily JS-rendered; we scrape their RSS feed which
 * returns clean XML and includes all the fields we need.
 * Tag feed: medium.com/feed/tag/<tag>
 */
async function scrapeMedium(tag = "programming") {
  const { data } = await axios.get(
    `https://medium.com/feed/tag/${encodeURIComponent(tag)}`,
    {
      headers: { ...HEADERS, Accept: "application/rss+xml, text/xml" },
      timeout: 15000,
    },
  );

  const $ = cheerio.load(data, { xmlMode: true });
  const articles = [];

  $("item").each((_, el) => {
    const item = $(el);

    const title = item.find("title").first().text().trim();
    const url =
      item.find("link").first().text().trim() ||
      item.find("guid").first().text().trim();

    const author =
      item.find("dc\\:creator, creator").first().text().trim() || "Medium";

    const dateRaw = item.find("pubDate").first().text().trim();

    // Medium embeds a full HTML snippet in <content:encoded>
    const rawContent = item.find("content\\:encoded, encoded").first().text();
    const $c = cheerio.load(rawContent);
    // Strip tags → plain text excerpt (first 300 chars)
    const content = $c.text().trim().slice(0, 300).replace(/\s+/g, " ") + "…";

    if (!title) return;

    articles.push({
      title,
      author,
      date: dateRaw ? new Date(dateRaw).toISOString() : null,
      site_name: "Medium",
      site_logo: "https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png",
      content,
      url,
    });
  });

  return articles;
}

module.exports = { scrapeMedium };