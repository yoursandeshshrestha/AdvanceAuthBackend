const express = require("express");
const cors = require("cors");
const router = require("./routes/Routers");
const PORT = 8000;
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

require("./DB/connection");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server starts at port ${PORT}`);
});
