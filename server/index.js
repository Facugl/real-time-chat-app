const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs...")
})

const port = process.env.PORT || 5000;
const uri = process.env.VITE_ATLAS_URL;

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose.connect(uri, {
  useNewUrlParser: true,
}).then(() => console.log("MongoDB connection established")).catch((error) => console.log("MongoDB connection failed: ", error.message));