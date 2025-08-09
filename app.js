const connectDB = require("./config/db.js");

const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes.js");

app.use(express.json());
app.use(cors({
    origin: "https://localhost:3000",
    credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
