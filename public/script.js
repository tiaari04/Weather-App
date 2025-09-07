const searchBar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const conditions = document.getElementById("conditions");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const feelsLike = document.getElementById("feels-like");
const low = document.getElementById("low");
const high = document.getElementById("high");
const humidity = document.getElementById("humidity");
const windspeed = document.getElementById("windspeed");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const container = document.getElementById("container");

const template = document.getElementById("city-template");
const templateContainer = document.getElementById("city-list");
const bookmarkBtn = document.querySelector(".bookmark-btn");

let currentCity = '';
let cities = getCities();

displayFirstCity();
refreshList();

async function getWeather(city) {
    const response = await fetch(`https://weather-app-413h.onrender.com/weather?city=${city}`);

    if (response.status == 500) {
        document.querySelector("#weather-div").style.display = "none";
        document.querySelector("#error-div").style.display = "flex";
        currentCity = '';
    }

    else {
        const data = await response.json();
        console.log(data)
        // Calculate local Unix time
        const localUnixTime = data.dt;
        const sunriseUnixTime = data.sys.sunrise;
        const sunsetUnixTime = data.sys.sunset;

        const coordinates = { lat: data.coord.lat, lon: data.coord.lon };

        const timezoneResponse = await fetch(`https://weather-app-413h.onrender.com/api/timezone?lat=${coordinates.lat}&lon=${coordinates.lon}`);
        const timezoneData = await timezoneResponse.json();

        if (timezoneData.status === "OK") {
            let timezone = timezoneData.zoneName;
            const localTime = getTime(localUnixTime, timezone);
            const sunriseTime = getTime(sunriseUnixTime, timezone);
            const sunsetTime = getTime(sunsetUnixTime, timezone);

            updateWeather(data, sunriseTime, sunsetTime, localTime);
        }
    }

    searchBar.value = "";
}

function displayFirstCity() {
    if (cities.length === 0) {
        // defualt to showing the weather in edmonton
        getWeather("Ottawa");
    }
    else {
        getWeather(cities[0]);
        bookmarkBtn.classList.add("bookmarked");
    }
}

searchBtn.addEventListener("click", function (e) {
    const city = searchBar.value.trim();
    if (city == "") {
        document.querySelector("#weather-div").style.display = "none";
        document.querySelector("#error-div").style.display = "none";
    }
    else {
        getWeather(city);
    }
});

bookmarkBtn.addEventListener("click", function (e) {
    if (cities.indexOf(currentCity) === -1) {
        addCity();
    }
    else {
        deleteCity();
    }
    toggleBookmark(currentCity);
    refreshList();
});

function getTime(unixTime, timezone) {
    return new Date(unixTime * 1000).toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
    });
}

function updateWeather(data, sunriseTime, sunsetTime, localTime) {
    // Change city name and log current city
    cityName.innerHTML = data.name;
    currentCity = data.name;

    // Change description
    description.innerHTML = data.weather[0].description;

    // Change temperature
    temp.innerHTML = Math.round(data.main.temp) + "&deg;C";
    feelsLike.innerHTML = "Feels like: " + Math.round(data.main.feels_like) + "&deg;C";
    high.innerHTML = "High: " + Math.round(data.main.temp_max) + "&deg;C";
    low.innerHTML = "Low:" + Math.round(data.main.temp_min) + "&deg;C";

    // Change sunrise and sunset times
    sunrise.innerHTML = sunriseTime;
    sunset.innerHTML = sunsetTime;

    // Change image and background
    let weatherDescription = data.weather[0].main;
    if (data.dt < data.sys.sunrise || data.dt > data.sys.sunset) {
        // It's night
        if (weatherDescription == "Clear") {
            conditions.className = "wi wi-night-clear";
            container.className = "night";
        }
        else if (weatherDescription == "Rain") {
            conditions.className = "wi wi-night-alt-rain";
            container.className = "rainy";
        }
        else if (weatherDescription == "Snow") {
            conditions.className = "wi wi-night-alt-snow";
            container.className = "snow";
        }
        else if (weatherDescription == "Drizzle") {
            conditions.className = "wi wi-night-alt-showers";
            container.className = "rainy";
        }
        else if (weatherDescription == "Thunderstorm") {
            conditions.className = "wi wi-night-alt-thunderstorm";
            container.className = "rainy";
        }
        else if (weatherDescription == "Clouds") {
            conditions.className = "wi wi-night-alt-cloudy";
            container.className = "cloudy";
        }
        else {
            conditions.className = "wi wi-night-fog";
            container.className = "cloudy";
        }
    }
    else {
        // It's day
        if (weatherDescription == "Clear") {
            conditions.className = "wi wi-day-sunny";
            container.className = "sunny";
        }
        else if (weatherDescription == "Rain") {
            conditions.className = "wi wi-day-rain";
            container.className = "rainy";
        }
        else if (weatherDescription == "Snow") {
            conditions.className = "wi wi-day-snow";
            container.className = "snow";
        }
        else if (weatherDescription == "Drizzle") {
            conditions.className = "wi wi-day-showers";
            container.className = "rainy";
        }
        else if (weatherDescription == "Thunderstorm") {
            conditions.className = "wi wi-day-thunderstorm";
            container.className = "rainy";
        }
        else if (weatherDescription == "Clouds") {
            conditions.className = "wi wi-day-cloudy";
            container.className = "cloudy";
        }
        else {
            conditions.className = "wi wi-day-light-wind";
            container.className = "sunny";
        }
    }

    // Change humidty
    humidity.innerHTML = data.main.humidity + "%";

    // Change windspeed
    windspeed.innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";

    // Decide for coloured or uncoloured bookmark
    // If city in citylist then colored, else uncolored
    toggleBookmark(currentCity);

    // Change display
    document.querySelector("#weather-div").style.display = "grid";
    document.querySelector("#error-div").style.display = "none";
}

function getCities() {
    const value = localStorage.getItem('cities') || "[]";

    return JSON.parse(value);
}

function setCities(cities) {
    const citiesJson = JSON.stringify(cities);

    localStorage.setItem("cities", citiesJson);
}

function addCity() {
    cities.unshift(currentCity);
    setCities(cities);
}

function deleteCity() {
    const cityToRemove = cities.indexOf(currentCity);
    cities.splice(cityToRemove, 1);
    setCities(cities);
}

function refreshList() {
    templateContainer.innerHTML = "";

    for (const city of cities) {
        const cityElement = template.content.cloneNode(true);
        const cityName = cityElement.querySelector(".city-btn");


        cityName.innerHTML = city;
        templateContainer.append(cityElement);

        cityName.addEventListener("click", () => {
            getWeather(city);
        });
    }
}

function toggleBookmark(currentCity) {
    const isBookmarked = bookmarkBtn.classList.contains("bookmarked");
    if (cities.indexOf(currentCity) === -1) {
        if (isBookmarked) {
            bookmarkBtn.classList.remove("bookmarked");
        }
    }
    else {
        if (!isBookmarked) {
            bookmarkBtn.classList.add("bookmarked");
        }
    }
}