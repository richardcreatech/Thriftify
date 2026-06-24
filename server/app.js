const express = require("express");
const cors = require("cors");
const {auth_routes} = require("./routes/auth")
const app = express();

app.use(cors());
app.use("/auth", auth_routes);



app.listen(5000, () => {
     console.log("The server is runnng successfully")
 })