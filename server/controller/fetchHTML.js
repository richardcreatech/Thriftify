const { HEADERS } = require("../config/headers");
const axios = require("axios");
const cheerio = require("cheerio");

const fetchHTML = async (url) => {
  const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
  return cheerio.load(data);
};

module.exports = { fetchHTML };
