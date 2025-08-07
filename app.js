const connectDB = require("./config/db.js");

const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
connectDB();

app.get("/", (req, res) => res.send("Hello, world!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
