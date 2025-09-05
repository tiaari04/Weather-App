import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files from /public
app.use(express.static("public"));

// Add a route to serve the index.html file for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Weather endpoint
app.get("/api/weather", async (req, res) => {
    const { city } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/weather?lang=en&units=metric&q=${city}&appid=${process.env.WEATHER_APIKEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch weather" });
    }
});

// Timezone endpoint
app.get("/api/timezone", async (req, res) => {
    const { lat, lon } = req.query;
    const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_APIKEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch timezone" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});