const API_KEY = "c2991ce65343997b0e2e3877a77d6b68"; // 🔑 Replace this!
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput    = document.getElementById("city-input");
const searchBtn    = document.getElementById("search-btn");
const weatherCard  = document.getElementById("weather-card");
const errorMsg     = document.getElementById("error-msg");
const errorText    = document.getElementById("error-text");
const cityName     = document.getElementById("city-name");
const dateEl       = document.getElementById("date");
const weatherImg   = document.getElementById("weather-img");
const tempEl       = document.getElementById("temp");
const feelsLike    = document.getElementById("feels-like");
const tempRange    = document.getElementById("temp-range");
const descEl       = document.getElementById("description");
const humidityEl   = document.getElementById("humidity");
const windEl       = document.getElementById("wind-speed");
const visibilityEl = document.getElementById("visibility");
const pressureEl   = document.getElementById("pressure");
const sunriseEl    = document.getElementById("sunrise");
const sunsetEl     = document.getElementById("sunset");
const lastUpdated  = document.getElementById("last-updated");

function getFormattedDate() {
  const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatTime(unix, offset) {
  const date  = new Date((unix + offset) * 1000);
  let hours   = date.getUTCHours();
  let mins    = date.getUTCMinutes();
  const ampm  = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  mins  = mins < 10 ? "0" + mins : mins;
  return `${hours}:${mins} ${ampm}`;
}

function setBackground(weatherMain) {
  document.body.className = "";
  const map = {
    Clear: "clear", Clouds: "clouds", Rain: "rain",
    Drizzle: "drizzle", Thunderstorm: "thunder",
    Snow: "snow", Mist: "mist", Haze: "haze",
    Fog: "mist", Smoke: "haze", Dust: "haze",
  };
  const cls = map[weatherMain] || "";
  if (cls) document.body.classList.add(cls);
}

async function fetchWeather(city) {
  try {
    searchBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled  = true;
    errorMsg.style.display = "none";

    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    if (data.cod === "404") { showError("City not found. Please check the spelling."); return; }
    if (data.cod === 401)   { showError("Invalid API key. Please check your key."); return; }

    displayWeather(data);
  } catch (err) {
    showError("Network error. Please check your connection.");
  } finally {
    searchBtn.innerHTML = '<i class="fa fa-search"></i> Search';
    searchBtn.disabled  = false;
  }
}

function displayWeather(data) {
  errorMsg.style.display = "none";
  weatherCard.style.display = "block";
  weatherCard.classList.remove("show");
  void weatherCard.offsetWidth;
  weatherCard.classList.add("show");

  cityName.textContent     = `${data.name}, ${data.sys.country}`;
  dateEl.innerHTML         = `<i class="fa fa-calendar"></i> ${getFormattedDate()}`;
  tempEl.textContent       = `${Math.round(data.main.temp)}°C`;
  feelsLike.textContent    = `Feels like ${Math.round(data.main.feels_like)}°C`;
  tempRange.textContent    = `H: ${Math.round(data.main.temp_max)}°  L: ${Math.round(data.main.temp_min)}°`;
  descEl.textContent       = data.weather[0].description;
  humidityEl.textContent   = `${data.main.humidity}%`;
  windEl.textContent       = `${Math.round(data.wind.speed * 3.6)} km/h`;
  visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  pressureEl.textContent   = `${data.main.pressure} hPa`;
  sunriseEl.textContent    = formatTime(data.sys.sunrise, data.timezone);
  sunsetEl.textContent     = formatTime(data.sys.sunset,  data.timezone);
  weatherImg.src           = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const now = new Date();
  lastUpdated.textContent  = `Updated at ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;

  setBackground(data.weather[0].main);
}

function showError(message) {
  errorText.textContent     = message;
  errorMsg.style.display    = "flex";
  weatherCard.style.display = "none";
}

cityInput.addEventListener("input", () => {
  if (cityInput.value.trim() === "") {
    weatherCard.style.display = "none";
    errorMsg.style.display    = "none";
    document.body.className   = "";
  }
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") { showError("Please enter a city name."); return; }
  fetchWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city === "") { showError("Please enter a city name."); return; }
    fetchWeather(city);
  }
});

fetchWeather("Chennai");