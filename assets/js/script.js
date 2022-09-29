// const apiKey = 'c4cb0eed6f48cdbf2ed519803c8b0164';

const searchEl = document.getElementById('search');
const searchInputEl = document.getElementById('search-input');
const citiesListEl = document.getElementById('cities');
const locationEl = document.getElementById('location');

// A function to render the html for each city saved on the list
const createCityCard = (cityName) => {
    const newCityEl = document.createElement('div');
    newCityEl.setAttribute('id', cityName);
    newCityEl.classList.add('border', 'm-1', 'rounded', 'p-1', 'text-center', 'border-dark', 'city');
    newCityEl.innerHTML = cityName
    citiesListEl.append(newCityEl)
}

// A function that stores new cities into local storage
const saveNewCity = (cityName) => {
    var cities;
    if (!localStorage.cities) {
        localStorage.setItem('cities', JSON.stringify([cityName]));
        cities = [cityName]
    } else {
        cities = JSON.parse(localStorage.cities)
        if (cities.includes(cityName)) {
            console.log(`${cityName} is already saved`);
        } else {
            cities.push(cityName);
            cities.sort();
            localStorage.setItem('cities', JSON.stringify(cities))
        }
    }
};

// Placeholder function for populating current weather
const renderCurrentWeather = (cityName) => {
    locationEl.textContent = cityName;
}

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

    // Execute API call
    console.log(`User searched for ${newCityName}`)

    // Clear input field
    searchInputEl.value = ''
}


searchEl.addEventListener('submit', handleSearchSubmit)