// API variables
const geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'c4cb0eed6f48cdbf2ed519803c8b0164';

// Search element variables
const searchEl = document.getElementById('search');
const searchInputEl = document.getElementById('search-input');
const citiesListEl = document.getElementById('cities');
const locationEl = document.getElementById('location');

// Weather element variables
const tempNowEl = document.getElementById('temp-now');
const windNowEl = document.getElementById('wind-now');
const humidityNowEl = document.getElementById('humidity-now');
const iconEl = document.getElementById('icon');
const forecastEl = document.getElementById('forecast')

// A function to write the html for each city saved on the list
const createCityCard = (cityName) => {
    const newCityEl = document.createElement('div');
    newCityEl.setAttribute('id', cityName);
    newCityEl.classList.add('border', 'm-1', 'rounded', 'p-1', 'text-center', 'border-dark', 'city');
    newCityEl.innerHTML = cityName
    return newCityEl
}

// A function to write the html for each five-day forecast card
const createForecastCard = (date, icon, description, temperature, wind, humidity) => {
    // Create the card
    const newForecastEl = document.createElement('div');
    newForecastEl.classList.add('border', 'm-1', 'rounded', 'p-1', 'text-center', 'border-dark', 'col');
    newForecastEl.setAttribute('style', 'height: fit-content')
    
    // Add the API data
    const newDateEl = document.createElement('h6');
    newDateEl.innerHTML = date;

    const newIconEl = document.createElement('img');
    newIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
    newIconEl.setAttribute('alt', description);

    const newTemperatureEl = document.createElement('p');
    newTemperatureEl.textContent = `Temp: ${temperature}` + '\u2109';

    const newWindEl = document.createElement('p');
    newWindEl.textContent = `Wind: ${wind} MPH`;

    const newHumidityEl = document.createElement('p');
    newHumidityEl.textContent = `Humidity: ${humidity} %`

    // Append the content to the card
    newForecastEl.append(newDateEl);
    newForecastEl.append(newIconEl);
    newForecastEl.append(newTemperatureEl);
    newForecastEl.append(newWindEl);
    newForecastEl.append(newHumidityEl);

    // Return the completed card
    return newForecastEl;
};

// A function that stores new cities into local storage
const saveNewCity = (cityName) => {
    // Create a variable to hold the cities in storage
    var cities;

    // If storage is empty create a new array with the new city
    if (!localStorage.cities) {
        localStorage.setItem('cities', JSON.stringify([cityName]));
        cities = [cityName]
    } else {
        // Parse the cities from local storage
        cities = JSON.parse(localStorage.cities)

        // If the city isn't already saved
        if (!cities.includes(cityName)) {
            // Add the new city to the array and alphabetize
            cities.push(cityName);
            cities.sort();

            // Save the array as a string in local storage
            localStorage.setItem('cities', JSON.stringify(cities))
        }
    }

    // Render the new list of saved cities to the page
    renderCitiesList();
};

// A function that renders the cities list from local storage
const renderCitiesList = () => {
    // Return if local storage is empty
    if (!localStorage.cities) {
        return
    };

    // Clear the list that may already be on the page
    while (citiesListEl.firstChild) {
        citiesListEl.removeChild(citiesListEl.firstChild);
    };

    // Pull the cities from local storage
    const cities = JSON.parse(localStorage.cities);

    // Iterate through the cities
    for (let i = 0; i < cities.length; i++) {
        // Create each card and append it to the list
        const newCityEl = createCityCard(cities[i]);
        citiesListEl.append(newCityEl);

        // Add an event listener to search for the city when clicked
        const newCityCard = document.getElementById(cities[i]);
        newCityCard.addEventListener('click', (event) => {
            searchInputEl.value = cities[i];
            handleSearchSubmit(event)
        })
    };
};

// A function for rendering the current weather section
const renderCurrentWeather = async (cityName) => {
    // Collect geo info needed for weather fetch
    const geoFetch = await fetch(`${geoUrl}?q=${cityName}&appid=${apiKey}`)
        .then(res => res.json())
        .then(res => res[0]);

    // Collect the weather data
    const weatherFetch = await fetch(`${weatherUrl}?lat=${geoFetch.lat}&lon=${geoFetch.lon}&appid=${apiKey}&units=imperial`)
        .then(res => res.json())

    // Change the content in the display
    locationEl.textContent = geoFetch.name;
    tempNowEl.textContent = weatherFetch.main.temp + '\u2109';
    windNowEl.textContent = weatherFetch.wind.speed + ' MPH';
    humidityNowEl.textContent = weatherFetch.main.humidity + ' %';
    iconEl.setAttribute('src', `http://openweathermap.org/img/wn/${weatherFetch.weather[0].icon}@2x.png`);
    iconEl.setAttribute('alt', weatherFetch.weather[0].description);
};

// A function for rendering the forecast section
const renderForecast = async (cityName) => {
    // Collect geo info needed for forecast fetch
    const geoFetch = await fetch(`${geoUrl}?q=${cityName}&appid=${apiKey}`)
    .then(res => res.json())
    .then(res => res[0]);

    // Collect forecast data
    const forecastFetch = await fetch(`${forecastUrl}?lat=${geoFetch.lat}&lon=${geoFetch.lon}&appid=${apiKey}&units=imperial`)
        .then(res => res.json())
        .then(res => res.list);
    
    // Clear the forecast that may already be on the page
    while (forecastEl.firstChild) {
        forecastEl.removeChild(forecastEl.firstChild);
    };

    // Render the cards and append them to the forecast section
    for (let i = 0; i < forecastFetch.length; i++) {
        const hour = forecastFetch[i].dt_txt.split(' ')[1].split(':')[0]
        if (hour === '12') {
            const data = forecastFetch[i];
            const newForecastEl = createForecastCard(data.dt_txt.split(' ')[0], data.weather[0].icon, data.weather[0].description, data.main.temp, data.wind.speed, data.main.humidity);
            forecastEl.append(newForecastEl);
        };
    };
};

// A function to handle the request for weather
const handleSearchSubmit = (event) => {
    // Prevent page from reloading
    event.preventDefault();

    // Validate that the form isn't blank
    if (!searchInputEl.value) {
        return
    };

    // Collect the user input and render the page
    const newCity = searchInputEl.value
    saveNewCity(newCity)
    renderCurrentWeather(newCity)
    renderForecast(newCity)

    // Clear input field
    searchInputEl.value = ''
};

searchEl.addEventListener('submit', handleSearchSubmit);

renderCitiesList();
