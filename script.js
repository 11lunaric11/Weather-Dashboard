const apiKey = "YOUR-API-KEY"; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  } else {
    alert("Please enter a city name!");
  }
});



function updateBackground(condition) {
  const body = document.body;
  if (condition.includes("rain")) {
    body.style.background = "linear-gradient(to bottom, #4e54c8, #8f94fb)";
  } else if (condition.includes("clear")) {
    body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  } else if (condition.includes("snow")) {
    body.style.background = "linear-gradient(to bottom, #83a4d4, #b6fbff)";
  } else {
    body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
  }
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  weatherResult.innerHTML = `
    <h2>${name}</h2>
    <img src="${icon}" alt="${weather[0].description}" />
    <p class="temp" data-temp="${main.temp}">Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Condition: ${weather[0].description}</p>
    <button onclick="toggleUnits()">Toggle °C/°F</button>
  `;
  updateBackground(weather[0].description);
}

async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  displayForecast(data.list);
}

function displayForecast(forecast) {
  const forecastContainer = document.createElement("div");
  forecastContainer.className = "forecast-container";
  forecast.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const temp = day.main.temp;
    const condition = day.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="${icon}" alt="${condition}" />
        <p>${temp}°C</p>
        <p>${condition}</p>
      </div>
    `;
  });
  weatherResult.appendChild(forecastContainer);
}

// Temperature unit toggle
let isCelsius = true;

function toggleUnits() {
  isCelsius = !isCelsius;
  const tempElements = document.querySelectorAll(".temp");
  tempElements.forEach((el) => {
    const temp = parseFloat(el.dataset.temp);
    el.textContent = isCelsius
      ? `Temperature: ${temp}°C`
      : `Temperature: ${(temp * 9) / 5 + 32}°F`;
  });
}

