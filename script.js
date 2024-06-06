const APIKey = '4649f802e8447d96b885b411e971fa94';
const queryURL = 'https://api.openweathermap.org/data/2.5/weather';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast';
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');
const searchForm = document.getElementById('search-form');

// Load search history from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
});

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

function getWeather(city) {
    const url = `${queryURL}?q=${city}&appid=${APIKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            updateSearchHistory(city);
            return fetch(`${forecastURL}?q=${city}&appid=${APIKey}&units=metric`);
        })
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching weather:', error));
}

function displayCurrentWeather(data) {
    // Display current weather data
}

function displayForecast(data) {
    const forecasts = data.list.filter((item, index) => index % 8 === 0); // One forecast per day
    let html = '';
    forecasts.forEach(forecast => {
        const { dt, main, weather, wind } = forecast;
        const date = new Date(dt * 1000).toLocaleDateString();
        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
        html += `
            <div class="forecast-item">
                <h3>${date}</h3>
                <img src="${iconUrl}" alt="${weather[0].description}">
                <p>Temperature: ${main.temp}°C</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
            </div>
        `;
    });
    forecastContainer.innerHTML = html;
}

function updateSearchHistory(city) {
    let searchHistory = localStorage.getItem('searchHistory');
    searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    let searchHistory = localStorage.getItem('searchHistory');
    searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
    const html = searchHistory.map(city => `<div>${city}</div>`).join('');
    searchHistoryContainer.innerHTML = html;
}