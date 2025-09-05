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

async function getWeather(city) {
    const response = await fetch(`/api/weather?city=${city}`);

    if (response.status == 500) {
        document.querySelector("#weather-div").style.display = "none";
        document.querySelector("#error-div").style.display = "flex";
    }

    else {
        const data = await response.json();
        console.log(data)
        // Calculate local Unix time
        const localUnixTime = data.dt;
        const sunriseUnixTime = data.sys.sunrise;
        const sunsetUnixTime = data.sys.sunset;

        const coordinates = { lat: data.coord.lat, lon: data.coord.lon };

        const timezoneResponse = await fetch(`/api/timezone?lat=${coordinates.lat}&lon=${coordinates.lon}`);
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

function getTime(unixTime, timezone) {
    return new Date(unixTime * 1000).toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
    });
}

function updateWeather(data, sunriseTime, sunsetTime, localTime) {
    // Change city name
    cityName.innerHTML = data.name;

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

    // Change image
    let weatherDescription = data.weather[0].main;
    if (data.dt < data.sys.sunrise || data.dt > data.sys.sunset) {
        // It's night
        if (weatherDescription == "Clear") {
            conditions.className = "wi wi-night-clear";
        }
        else if (weatherDescription == "Rain") {
            conditions.className = "wi wi-night-alt-rain";
        }
        else if (weatherDescription == "Snow") {
            conditions.className = "wi wi-night-alt-snow";
        }
        else if (weatherDescription == "Drizzle") {
            conditions.className = "wi wi-night-alt-showers";
        }
        else if (weatherDescription == "Thunderstorm") {
            conditions.className = "wi wi-night-alt-thunderstorm";
        }
        else if (weatherDescription == "Clouds") {
            conditions.className = "wi wi-night-alt-cloudy";
        }
        else {
            conditions.className = "wi wi-night-fog";
        }
    }
    else {
        // It's day
        if (weatherDescription == "Clear") {
            conditions.className = "wi wi-day-sunny";
        }
        else if (weatherDescription == "Rain") {
            conditions.className = "wi wi-day-rain";
        }
        else if (weatherDescription == "Snow") {
            conditions.className = "wi wi-day-snow";
        }
        else if (weatherDescription == "Drizzle") {
            conditions.className = "wi wi-day-showers";
        }
        else if (weatherDescription == "Thunderstorm") {
            conditions.className = "wi wi-day-thunderstorm";
        }
        else if (weatherDescription == "Clouds") {
            conditions.className = "wi wi-day-cloudy";
        }
        else {
            conditions.className = "wi wi-day-light-wind";
        }
    }

    // Change humidty
    humidity.innerHTML = data.main.humidity + "%";

    // Change windspeed
    windspeed.innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";


    // Change display
    document.querySelector("#weather-div").style.display = "grid";
    document.querySelector("#error-div").style.display = "none";
}