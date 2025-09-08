# Weather-App

# **Live Demo**: [Weather App](https://weather-app-413h.onrender.com)
The webpage may take a minute to spin up.

# **Overview**

This is a responsive weather web application that allows users to search for cities and view real-time weather information. The app fetches data from the OpenWeather API through a Node.js + Express backend (used as a proxy to keep API keys secure). It also displays additional details such as humidity, wind speed, and sunrise/sunset times. Users can bookmark cities for quick access, and the app automatically adapts its background to day or night based on the location’s local time.

# **Features**

* Search by city to get live weather data

* Local time support using TimezoneDB API

* Bookmark cities for easy re-access (stored in localStorage)

* Dynamic background that switches between day and night modes

* Error handling for invalid city searches

* Responsive design for both desktop and mobile

* Glassmorphism UI with clean, modern design

# **Technologies Used**

Frontend:

* HTML5

* CSS3

* JavaScript (DOM manipulation, Fetch API, localStorage)

Backend:

* Node.js

* Express.js

* PostgreSQL for database storage

APIs:

* OpenWeather API for weather data

* TimezoneDB API for local time data

Deployment:

* Hosted on Render
