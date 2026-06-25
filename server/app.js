const express = require("express");
const cors = require("cors");
const { auth_routes } = require("./routes/auth");
const { article_routes } = require("./routes/article_route");
const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use("/auth", auth_routes);
app.use("/articles", article_routes);

app.listen(5000, () => {
  console.log("The server is runnng successfully");
});
