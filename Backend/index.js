const express = require("express");
const ConnectDB = require("./config/db");
const UserRouter = require("./routes/userRoutes");
const PostRouter = require("./routes/postRouter");

require("dotenv").config();

const app = express();
ConnectDB();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/users", UserRouter);
app.use("/api/post", PostRouter);

app.get("/", (req, res) => {
  res.send("jai shree ram");
});

app.listen(port, () => {
  console.log("server start at port 5000");
});
