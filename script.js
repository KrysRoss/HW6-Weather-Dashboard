// API Keys
const weatherApiKey = "58063038f1d17acc2590509cab7077dd";
const positionStackApiKey = "ab07379cbfa03c3802366788209289e3";

// HTML Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cityDateHeader = document.getElementById("cityDate");
const currentDecription = document.getElementById("currentDescription");
const currentTemp = document.getElementById("currentTemp");
const currentWind = document.getElementById("currentWind");
const currentHumidity = document.getElementById("currentHumidity");
const currentUvIndex = document.getElementById("currentUvIndex");

const fiveDayElements = document.querySelectorAll(".five-day");

// When user clicks search button, check to make sure there's an input
// and then fetch the longitude and latitude for that query
// once we have the long and lat, fetch the weather for that location
searchBtn.addEventListener("click", getLongLat);
function getLongLat() {
  const searchQuery = searchInput.value;
  cityDateHeader.innerHTML = searchQuery;
  if (searchQuery.length) {
    searchBtn.innerHTML = "Searching, please wait..";
    fetch(
      `http://api.positionstack.com/v1/forward?query=${searchQuery}&access_key=${positionStackApiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const city = data.data[0];
        const lat = city.latitude;
        const long = city.longitude;
        getWeather(lat, long);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }
}

// For a given latitude and longitude, fetch weather data
// and then inject values into our HTML elements
function getWeather(lat, long) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${weatherApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      currentDecription.innerHTML = data.current.weather[0].description;
      currentTemp.innerHTML = data.current.temp + "°F";
      currentWind.innerHTML = data.current.wind_speed + "MPH";
      currentHumidity.innerHTML = data.current.humidity + "%";
      currentUvIndex.innerHTML = data.current.uvi;

      // Iterate through our five days elements and inject info
      // from first 5 elements in data for upcoming days
      fiveDayElements.forEach((element, index) => {
        const tempChild = element.querySelector("#temp");
        const windChild = element.querySelector("#wind");
        const humidityChild = element.querySelector("#humidity");

        const temp = data.daily[index].temp.day + "°F";
        const wind = data.daily[index].wind_speed + "MPH";
        const humidity = data.daily[index].humidity + "%";

        tempChild.innerHTML = temp;
        windChild.innerHTML = wind;
        humidityChild.innerHTML = humidity;
      });

      searchBtn.innerHTML = "Search";
    });
}
