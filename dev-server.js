// Minimal local dev server to host static site and proxy /api/chat to the existing handler
require("dotenv").config();
const express = require("express");
const path = require("path");

const chatHandler = require(path.join(__dirname, "api", "chat"));

const app = express();
app.use(express.json());

// Serve static site (index.html + assets)
app.use(express.static(path.join(__dirname)));

// Mount the existing serverless handler at /api/chat
app.post("/api/chat", (req, res) => {
  // The handler expects (req, res)
  return chatHandler(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Dev server running: http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "Warning: GEMINI_API_KEY not set. Set it in a .env file or the environment to test the chat.",
    );
  }
});
