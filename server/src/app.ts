import express from "express";
import dotenv from "dotenv";

// Set up env and server
dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.json("hey");
});

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log("\x1b[36m", `Server running on port ${port} 🏃‍♂️`)
);
