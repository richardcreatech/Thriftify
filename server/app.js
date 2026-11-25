
const express = require("express");
const cors = require("cors");

const { auth_routes } = require("./routes/auth");
const { article_routes } = require("./routes/article_route");
const { market_routes } = require("./routes/market_auth");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
  })
);

app.use("/auth", auth_routes);
app.use("/articles", article_routes);
app.use("/market", market_routes);

// Export the app for Vercel
module.exports = app;

// Start a local server only when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
