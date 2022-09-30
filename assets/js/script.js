// API variables
const geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = 'c4cb0eed6f48cdbf2ed519803c8b0164';

// HTML variable
const searchEl = document.getElementById('search');
const searchInputEl = document.getElementById('search-input');
const citiesListEl = document.getElementById('cities');
const locationEl = document.getElementById('location');
const tempNowEl = document.getElementById('temp-now');
const windNowEl = document.getElementById('wind-now');
const humidityNowEl = document.getElementById('humidity-now');
const uvNowEl = document.getElementById('uv-now')



// A function to render the html for each city saved on the list
const createCityCard = (cityName) => {
    const newCityEl = document.createElement('div');
    newCityEl.setAttribute('id', cityName);
    newCityEl.classList.add('border', 'm-1', 'rounded', 'p-1', 'text-center', 'border-dark', 'city');
    newCityEl.innerHTML = cityName
    return newCityEl
}

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
// A function for populating current weather
const renderCurrentWeather = async (cityName) => {
    const geoFetch = await fetch(`${geoUrl}?q=${cityName}&appid=${apiKey}`)
        .then(res => res.json())
        .then(res => res[0]);

    const weatherFetch = await fetch(`${weatherUrl}?lat=${geoFetch.lat}&lon=${geoFetch.lon}&appid=${apiKey}`)
        .then(res => res.json())

    locationEl.textContent = geoFetch.name;
    tempNowEl.textContent = weatherFetch.main.temp;
    windNowEl.textContent = weatherFetch.wind.speed;
    humidityNowEl.textContent = weatherFetch.main.humidity;
};

const handleSearchSubmit = (event) => {
    // Prevent page from reloading
    event.preventDefault();

    // Validate that the form isn't blank
    if (!searchInputEl.value) {
        return
    };

    // Store the city name in a variable
    const newCityName = searchInputEl.value

    // If the city isn't already saved, save it
    saveNewCity(newCityName)

    // TEST: Render the city's name to the current weather card
    renderCurrentWeather(newCityName)

    // Clear input field
    searchInputEl.value = ''
};

searchEl.addEventListener('submit', handleSearchSubmit);

renderCitiesList();