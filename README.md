
SkyCast ☀️🌧️🌩️

SkyCast is a simple weather application that fetches and displays current conditions and forecasts using the OpenWeather API
.
It is built with HTML, Sass (SCSS), and Vanilla JavaScript.

🚀 Features

Search by city name to get weather details.

Displays current temperature, feels like, humidity, wind speed, and precipitation.

Shows a 5-day forecast grouped by day with min/max temperatures.

Displays an hourly forecast (next 18 hours).

Condition-based icons (sun, rain, clouds, snow, etc.).

# Weather Application

This is a simple weather application that fetches and displays weather data using a weather API. The application is built with HTML, CSS (using Sass), and JavaScript.
Setup Instructions

Clone the repository

git clone <repository-url>
cd weather-app


Install dependencies

npm install


Add your API key
Create or edit src/js/config.js:

window.OPENWEATHER_API_KEY = "your_api_key_here";


Start the development server (Vite)

npm run dev

## Project Structure

```
weather-app
├── src
│   ├── js
│   │   ├── main.js
│   │   ├── api.js
│   │   └── utils.js
│   ├── scss
│   │   ├── main.scss
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── components
│   │       ├── _header.scss
│   │       ├── _weather-card.scss
│   │       └── _forecast.scss
│   └── index.html
├── dist
├── package.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile Sass**:
   Make sure you have Sass installed. You can compile the SCSS files using:
   ```bash
   sass src/scss/main.scss dist/styles.css
   ```

4. **Run the application**:
   Open `src/index.html` in your browser to view the application.

## Usage

- Enter a location in the input field to fetch the weather data.
- The application will display the current weather and a forecast for the upcoming days.

## License

This project is licensed under the MIT License.


<img width="1297" height="693" alt="Image" src="https://github.com/user-attachments/assets/5ceef749-6a72-4a0a-b2d7-86634b51dd38" />
