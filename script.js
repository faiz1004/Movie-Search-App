const API_KEY = 'cf0640f6'; // Your OMDb API key
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const movieDetailsDiv = document.getElementById('movieDetails');
const loadingDiv = document.getElementById('loading');
const errorMessageDiv = document.getElementById('errorMessage');
const modal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close');

// Set background color for body and header
document.body.style.backgroundColor = "#f4f4f4";  // Light grey background for the page
document.querySelector('header').style.backgroundColor = "#333"; // Dark background for header
// document.querySelector('header h1').style.color = "white"; // Header text color

// Search when button is clicked
searchButton.addEventListener('click', searchMovies);

// Search when Enter key is pressed
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

// Fetch movie list based on search query
async function searchMovies() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Show loading and clear previous results
    loadingDiv.style.display = "block";
    errorMessageDiv.style.display = "none";
    resultsDiv.innerHTML = '';
    movieDetailsDiv.innerHTML = '';

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            displayMovies(data.Search);
        } else {
            throw new Error(data.Error || "No movies found.");
        }
    } catch (error) {
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = "block";
    } finally {
        loadingDiv.style.display = "none";
    }
}

// Display the list of movies
function displayMovies(movies) {
    resultsDiv.innerHTML = '';
    resultsDiv.style.backgroundColor = "#fff"; // White background for the results

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.style.backgroundColor = "#f0f0f0"; // Light background for each movie item
        movieItem.style.padding = "10px";
        movieItem.style.borderRadius = "8px";
        movieItem.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" style="width: 100%; height: auto;">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
        `;
        movieItem.addEventListener('click', () => window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank'));
        resultsDiv.appendChild(movieItem);
    });
}

// Fetch detailed movie information
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}`);
        const movie = await response.json();

        if (movie.Response === "True") {
            displayMovieDetails(movie);
        } else {
            throw new Error("Could not load movie details.");
        }
    } catch (error) {
        movieDetailsDiv.innerHTML = `<p>Could not load movie details.</p>`;
    }
}

// Display movie details in the modal
function displayMovieDetails(movie) {
    movieDetailsDiv.style.backgroundColor = "#f4f4f4"; // Light grey background for movie details
    movieDetailsDiv.innerHTML = `
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" style="width: 400px; height: 400px;">
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
    `;
    modal.style.display = "block";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Dark background for modal overlay
    modal.style.color = "white"; // White text in modal
}

// Close modal when clicking the close button
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Close modal when clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
