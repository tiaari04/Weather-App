url = "https://api.openweathermap.org/data/2.5/weather?lang=en&units=metric&q=";


const searchBar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");


async function getWeather(url) {
    try {
        const city = searchBar.value.trim();
        if (city == "") {

        }
        else {
            const response = await fetch(url + city + "&appid=" + apikey);

            if (!response.ok) {

            }

            const data = await response.json();
            console.log(data);
        }
    }

    catch (error) {

    }
}

searchBtn.addEventListener("click", function (e) {
    getWeather(url);
});