// config.js already has:
// window.OPENWEATHER_API_KEY = "your_api_key_here";

const geoUrl = "https://api.openweathermap.org/geo/1.0/direct";
const currentUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

// map OpenWeather "main" condition → your /images icons
const iconMap = {
  Thunderstorm: "images/icon-storm.webp",
  Drizzle: "images/icon-drizzle.webp",
  Rain: "images/icon-rain.webp",
  Snow: "images/icon-snow.webp",
  Mist: "images/icon-fog.webp",
  Smoke: "images/icon-fog.webp",
  Haze: "images/icon-fog.webp",
  Dust: "images/icon-fog.webp",
  Fog: "images/icon-fog.webp",
  Clear: "images/icon-sunny.webp",
  Clouds: "images/icon-overcast.webp"
};

document.getElementById("search-btn").addEventListener("click", handleSearch);

async function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return alert("Enter a city!");

  try {
    const coords = await getCoordsForCity(query);
    if (!coords) return alert("City not found!");

    const { lat, lon, name, country } = coords;

    // current weather
    const currentRes = await fetch(
      `${currentUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${window.OPENWEATHER_API_KEY}`
    );
    const currentData = await currentRes.json();

    // 5-day / 3h forecast
    const forecastRes = await fetch(
      `${forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${window.OPENWEATHER_API_KEY}`
    );
    const forecastData = await forecastRes.json();

    // update UI
    updateUI(name, country, currentData, forecastData);
  } catch (err) {
    console.error("Error fetching weather:", err);
    alert("Something went wrong fetching weather!");
  }
}

async function getCoordsForCity(city) {
  const res = await fetch(
    `${geoUrl}?q=${city}&limit=1&appid=${window.OPENWEATHER_API_KEY}`
  );
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
}

function updateUI(city, country, current, forecast) {
  // --- Current weather ---
  document.getElementById("location").textContent = `${city}, ${country}`;
  document.getElementById("date").textContent = new Date().toDateString();
  document.getElementById("temperature").textContent = `${current.main.temp}°C`;
  document.getElementById("feels-like").textContent = `${current.main.feels_like}°C`;
  document.getElementById("humidity").textContent = `${current.main.humidity}%`;
  document.getElementById("wind").textContent = `${current.wind.speed} km/h`;
  document.getElementById("precipitation").textContent =
    current.rain?.["1h"] ? `${current.rain["1h"]} mm` : "0 mm";

  // replace text icon with image
  const condition = current.weather[0].main;
  const iconPath = iconMap[condition] || "images/icon-error.svg";
  const iconElement = document.getElementById("icon");
  iconElement.innerHTML = `<img src="${iconPath}" alt="${condition}" />`;

  // --- Daily forecast ---
  const dailyForecastEl = document.getElementById("daily-forecast");
  dailyForecastEl.innerHTML = "";

  const groupedByDay = {};
  forecast.list.forEach((item) => {
    const day = new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push(item);
  });

  Object.keys(groupedByDay).forEach((day) => {
    const temps = groupedByDay[day].map((d) => d.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const condition = groupedByDay[day][0].weather[0].main;
    const iconPath = iconMap[condition] || "images/icon-error.svg";

    dailyForecastEl.innerHTML += `
      <div class="day">
        <p>${day}</p>
        <img src="${iconPath}" class="width-60" alt="${condition}" />
        <p>${Math.round(max)}° / ${Math.round(min)}°</p>
      </div>
    `;
  });

  // --- Hourly forecast (next 6 entries ~ 18h) ---
  const hourlyForecastEl = document.getElementById("hourly-forecast");
  hourlyForecastEl.innerHTML = forecast.list
    .slice(0, 6)
    .map((h) => {
      const time = new Date(h.dt_txt).getHours();
      const condition = h.weather[0].main;
      const iconPath = iconMap[condition] || "images/icon-error.svg";

      return `
        <div class="hour">
          <span>${time}:00</span>
          <img src = "${iconPath}"
          class = "width-60"
          alt = "${condition}" / >
          <span>${Math.round(h.main.temp)}°</span>
        </div>
      `;
    })
    .join("");
}

const ddlUnits = document.getElementById("ddl__units");
ddlUnits.addEventListener("change", getGeoData);