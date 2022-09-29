// const apiKey = c4cb0eed6f48cdbf2ed519803c8b0164;

const searchEl = document.getElementById('search')
const searchInputEl = document.getElementById('search-input')

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