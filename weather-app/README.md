# Weather Application

This is a simple weather application that fetches and displays weather data using a weather API. The application is built with HTML, CSS (using Sass), and JavaScript.

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