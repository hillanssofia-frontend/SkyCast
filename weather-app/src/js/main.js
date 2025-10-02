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
  Clouds: "images/icon-overcast.webp",
};

// Store current units state
let currentUnits = {
  temp: "c", // 'c' or 'f'
  wind: "kmh", // 'kmh' or 'mph'
  precip: "mm", // 'mm' or 'in'
};
// Store current data globally to reuse for unit conversion
let currentData = null;
let ForecastData = null;
let currentCity = null;
let currentCountry = null;
let currentCoords = null;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const unitBtn = document.getElementById("unitBtn");
  const unitMenu = document.getElementById("unitMenu");

  if (unitBtn && unitMenu) {
    openMenu(unitBtn, unitMenu);
  }
  // Initialize unit buttons and event listeners
  initializeUnitButtons();

  // Set up search button
  document.getElementById("search-btn").addEventListener("click", handleSearch);
});

function openMenu(btn, menu) {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  // Close menu when clicking outside
  document.addEventListener("click", () => {
    menu.classList.remove("open");
  });

  // Prevent menu clicks from closing the menu
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Initialize unit buttons with event listeners
function initializeUnitButtons() {
  // System switch button
  const switchBtn = document.querySelector('[data-action="switch-system"]');
  if (switchBtn) {
    switchBtn.addEventListener("click", switchSystem);
  }
  // Individual unit buttons
  const unitButtons = document.querySelectorAll("[data-group]");
  unitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const group = this.getAttribute("data-group");
      const value = this.getAttribute("data-value");
      setUnit(group, value);
    });
  });
  // Update UI to reflect current units
  updateUnitButtonsUI();
}

// Switch entire system between metric and imperial
function switchSystem() {
  const isCurrentlyMetric =
    currentUnits.temp === "c" &&
    currentUnits.wind === "kmh" &&
    currentUnits.precip === "mm";

  if (isCurrentlyMetric) {
    // Switch to Imperial
    currentUnits = {
      temp: "f",
      wind: "mph",
      precip: "in",
    };
  } else {
    // Switch to Metric
    currentUnits = {
      temp: "c",
      wind: "kmh",
      precip: "mm",
    };
  }

  updateUnitButtonsUI();

  //  Ensure UI updates with current data when system is switched
  if (currentData && ForecastData) {
    updateUI(currentCity, currentCountry, currentData, ForecastData);
  } else {
    // If no data exists yet, you might want to trigger a search for current location
    // or at least update any default displayed values
    console.log("No weather data available to update");
  }
}

// Set individual unit
function setUnit(group, value) {
  currentUnits[group] = value;
  updateUnitButtonsUI();

  // If we have current data, update the display with new units
  if (currentData && ForecastData) {
    updateUI(currentCity, currentCountry, currentData, ForecastData);
  }
}

// Update unit buttons UI to show active states
function updateUnitButtonsUI() {
  // Remove active class from all unit buttons
  const allUnitButtons = document.querySelectorAll("[data-group]");
  allUnitButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Add active class to current unit buttons
  Object.keys(currentUnits).forEach((group) => {
    const activeButton = document.querySelector(
      `[data-group="${group}"][data-value="${currentUnits[group]}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }
  });

  // Update the system switch button text
  const systemLabel = document.querySelector("[data-system-label]");
  if (systemLabel) {
    const isMetric =
      currentUnits.temp === "c" &&
      currentUnits.wind === "kmh" &&
      currentUnits.precip === "mm";
    systemLabel.textContent = isMetric ? "Metric" : "Imperial";
  }
}

// Convert temperature between Celsius and Fahrenheit
function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temp;

  if (fromUnit === "c" && toUnit === "f") {
    return (temp * 9) / 5 + 32;
  } else if (fromUnit === "f" && toUnit === "c") {
    return ((temp - 32) * 5) / 9;
  }
  return temp;
}

// Convert wind speed between km/h and mph
function convertWindSpeed(speed, fromUnit, toUnit) {
  if (fromUnit === toUnit) return speed;

  if (fromUnit === "kmh" && toUnit === "mph") {
    return speed * 0.621371;
  } else if (fromUnit === "mph" && toUnit === "kmh") {
    return speed * 1.60934;
  }
  return speed;
}

// Convert precipitation between mm and inches
function convertPrecipitation(precip, fromUnit, toUnit) {
  if (fromUnit === toUnit) return precip;

  if (fromUnit === "mm" && toUnit === "in") {
    return precip * 0.0393701;
  } else if (fromUnit === "in" && toUnit === "mm") {
    return precip / 0.0393701;
  }
  return precip;
}

// Get API units parameter based on current temperature unit
function getApiUnits() {
  return currentUnits.temp === "c" ? "metric" : "imperial";
}

async function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return alert("Enter a city!");

  try {
    const coords = await getCoordsForCity(query);
    if (!coords) return alert("City not found!");

    const { lat, lon, name, country } = coords;
    currentCity = name;
    currentCountry = country;
    currentCoords = { lat, lon };

    // Get current units for API call
    const apiUnits = getApiUnits();

    // current weather
    const currentRes = await fetch(
      `${currentUrl}?lat=${lat}&lon=${lon}&units=${apiUnits}&appid=${window.OPENWEATHER_API_KEY}`
    );

    currentData = await currentRes.json();
    // console.log(currentData);

    // 5-day / 3h forecast
    const forecastRes = await fetch(
      `${forecastUrl}?lat=${lat}&lon=${lon}&units=${apiUnits}&appid=${window.OPENWEATHER_API_KEY}`
    );
    ForecastData = await forecastRes.json();

    // update UI
    updateUI(name, country, currentData, ForecastData);
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
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
}

function updateUI(city, country, current, forecast) {
  // Determine unit symbols
  const tempUnit = currentUnits.temp === "c" ? "C" : "F";
  const speedUnit = currentUnits.wind === "kmh" ? "km/h" : "mph";
  const precipUnit = currentUnits.precip === "mm" ? "mm" : "inch";

  // Convert values based on API response and user preferences
  let displayTemp = current.main.temp;
  let displayFeelsLike = current.main.feels_like;
  let displayWind = current.wind.speed;
  let displayHumidity = current.main.humidity;
  let displayPrecip = 0;

  const apiUnits = getApiUnits();

  if (apiUnits === "metric" && currentUnits.temp === "f") {
    displayTemp = (displayTemp * 9) / 5 + 32;
    displayFeelsLike = (displayFeelsLike * 9) / 5 + 32;
  } else if (apiUnits === "imperial" && currentUnits.temp === "c") {
    // Convert F to C

    displayTemp = ((displayTemp - 32) * 5) / 9;
    displayFeelsLike = ((displayFeelsLike - 32) * 5) / 9;
  }
  // API returned m/s
  if (currentUnits.wind === "kmh") {
    // Convert m/s to km/h
    displayWind = (displayWind * 3.6).toFixed(2);
  } else if (currentUnits.wind === "mph") {
    // Convert m/s to mph
    displayWind = displayWind * (2.23).toFixed(2);
  } else {
    // API returned mph
    if (currentUnits.wind === "kmh") {
      // Convert mph to km/h
      displayWind = displayWind * (1.60934).toFixed(2);
    }
  }

  if (currentUnits.precip === "in") {
    displayPrecip = displayPrecip * 0.0393701;
  }

  // --- Current weather ---
  document.getElementById("location").textContent = `${city}, ${country}`;
  document.getElementById("date").textContent = new Date().toDateString();
  document.getElementById("temperature").textContent = `${Math.round(
    displayTemp
  )}°${tempUnit}`;
  document.getElementById("feels-like").textContent = `${Math.round(
    displayFeelsLike
  )}°${tempUnit}`;
  document.getElementById("humidity").textContent = `${displayHumidity}%`;
  document.getElementById("wind").textContent = `${displayWind} ${speedUnit}`;

  // Handle precipitation - OpenWeather uses different property names
  let precipitation = 0;
  if (current.rain && current.rain["1h"]) {
    precipitation = current.rain["1h"];
  } else if (current.snow && current.snow["1h"]) {
    precipitation = current.snow["1h"];
  }

  // Convert precipitation if needed (simplified conversion)
  displayPrecip = precipitation;
  if (currentUnits === "in") {
    displayPrecip = (precipitation * 0.0393701).toFixed(2); // mm to inches
  }

  document.getElementById(
    "precipitation"
  ).textContent = `${displayPrecip} ${precipUnit}`;

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
    const day = new Date(item.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
    });
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push(item);
  });

  Object.keys(groupedByDay).forEach((day) => {
    let temps = groupedByDay[day].map((d) => d.main.temp);

    // Convert temperatures if needed
    if (apiUnits === "metric" && currentUnits.temp === "f") {
      temps = temps.map((temp) => (temp * 9) / 5 + 32);
    } else if (apiUnits === "imperial" && currentUnits.temp === "c") {
      temps = temps.map((temp) => ((temp - 32) * 5) / 9);
    }

    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const condition = groupedByDay[day][0].weather[0].main;
    const iconPath = iconMap[condition] || "images/icon-error.svg";

    dailyForecastEl.innerHTML += `
      <div class="day">
        <p>${day}</p>
        <img src="${iconPath}" class="width-60" alt="${condition}" />
        <p>${Math.round(max)}°${tempUnit} / ${Math.round(min)}°${tempUnit}</p>
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

      // Convert temperature if needed
      if (apiUnits === "metric" && currentUnits.temp === "f") {
        hourTemp = (hourTemp * 9) / 5 + 32;
      } else if (apiUnits === "imperial" && currentUnits.temp === "c") {
        hourTemp = ((hourTemp - 32) * 5) / 9;
      }

      return `
        <div class="hour">
          <span>${time}:00</span>
          <img src = "${iconPath}"
          class = "width-60"
          alt = "${condition}" / >
          <span>${Math.round(h.main.temp)}°${tempUnit}</span>
        </div>
      `;
    })
    .join("");
}
