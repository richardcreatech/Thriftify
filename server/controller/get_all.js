const { fetchHTML } = require("./fetchHTML");
const { scrapeHubSpot } = require("./scrapeHubSpot");
const { scrapeFreeCodeCamp } = require("./scrape_freecode");
const { scrapeMedium } = require("./scrapeMedium");
const cheerio = require("cheerio");

const get_all_articles = async (req, res) => {
  const sources = req.query.sources
    ? req.query.sources.split(",").map((s) => s.toLowerCase().trim())
    : ["freecodecamp", "hubspot", "medium"];

  const tag = req.query.tag || "programming";

  const tasks = [];
  if (sources.includes("freecodecamp"))
    tasks.push(
      scrapeFreeCodeCamp().then((d) => ({ source: "freecodecamp", data: d })),
    );
  if (sources.includes("hubspot"))
    tasks.push(scrapeHubSpot().then((d) => ({ source: "hubspot", data: d })));
  if (sources.includes("medium"))
    tasks.push(scrapeMedium(tag).then((d) => ({ source: "medium", data: d })));

  const results = await Promise.allSettled(tasks);

  const articles = [];
  const errors = [];

  results.forEach((r) => {
    if (r.status === "fulfilled") {
      articles.push(...r.value.data);
    } else {
      errors.push(r.reason?.message || "Unknown error");
    }
  });

  // Sort newest first (nulls last)
  articles.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  res.json({ total: articles.length, errors, articles });
};

module.exports = { get_all_articles };
