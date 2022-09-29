// const apiKey = c4cb0eed6f48cdbf2ed519803c8b0164;

const searchEl = document.getElementById('search')
const searchInputEl = document.getElementById('search-input')
const citiesListEl = document.getElementById('cities')

const createCityCard = (cityName) => {
    const newCityEl = document.createElement('div');
    newCityEl.setAttribute('id', cityName);
    newCityEl.classList.add('border', 'm-1', 'rounded', 'p-1', 'text-center', 'border-dark', 'city');
    newCityEl.innerHTML = cityName
    citiesListEl.append(newCityEl)
}

const handleSearchSubmit = (event) => {
    // Prevent page from reloading
    event.preventDefault();

    // Validate that the form isn't blank
    if (!searchInputEl.value) {
        return
    }

    // Execute API call
    console.log(`User searched for ${searchInputEl.value}`)

    // Clear input field
    searchInputEl.value = ''
}


searchEl.addEventListener('submit', handleSearchSubmit)