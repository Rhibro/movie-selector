const apiKey = "4291752680fb18b8f286cc679c1e1d8e";
const baseUrl =  "https://api.themoviedb.org/3"; //`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const genreApiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

let genreMap = {};

let currentPage = 1; // Track the current page
const moviesPerPage = 10; // Number of movies to load per page
let currentMode = 'topRated'; // switching between modes for pagination 
let totalMoviesLoaded = 0; // Track the total number of movies loaded

// Function to fetch top-rated movies
async function fetchTopRatedMovies(page) {
  const url = `${baseUrl}/movie/top_rated?api_key=${apiKey}&page=${page}`;
  console.log(`Fetching top-rated movies from: ${url}`); // Log the URL being fetched

  showLoading(); // Show loading indicator

  try {
    const response = await fetch(url);
    if (!response.ok) {
      displayError(`HTTP error! status: ${response.status}`); 
    }
    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      displayMovies(data.results);
    } else {
      displayError("No top-rated movies found. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    hideLoading(); // Hide loading indicator
  }
}

// Function to load initial movies
async function fetchInitialMovies() {
  console.log("Fetching initial top-rated movies..."); // Log when fetching initial movies
  await fetchTopRatedMovies(currentPage);
}

// Function to fetch movies by genre with pagination
async function fetchMoviesByGenre(genreId, page) {
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;

  showLoading(); // Show loading indicator

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies by genre. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      displayMovies(data.results);
    } else {
      displayError("No movies found for the selected genre.");
    }
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
  } finally {
    hideLoading(); // Hide loading indicator
}
}


// Function to display movies on the page
function displayMovies(movies) {
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ''; // Clear previous movies to only show the current page's movies
  
  // Check if movies are being passed correctly
  console.log("Movies to display:", movies); // Log the movies being displayed

  // Append only the first 10 movies from the fetched results
  const moviesToDisplay = movies.slice(0, moviesPerPage); // Ensure only 10 movies are displayed
  moviesToDisplay.forEach(movie => {
    const movieItem = document.createElement('li');
    movieItem.textContent = `${movie.title} (rating: ${movie.vote_average})`;
    movieItem.addEventListener('click', () => {
      displayMovieDetails(movie);
    });
    movieList.appendChild(movieItem);
  });

  // Update the total movies loaded
  totalMoviesLoaded += moviesToDisplay.length;

  // Log the total movies loaded
  console.log(`Total movies loaded: ${totalMoviesLoaded}`);
}


// Function to handle page change (Previous/Next)
function handlePageChange(increment) {
  currentPage += increment;

  // Ensure the page number stays valid
  if (currentPage < 1) currentPage = 1;

  if (currentMode === 'topRated') {
    fetchTopRatedMovies(currentPage);
  } else {
    fetchMoviesByGenre(currentMode, currentPage);
  }

   // Update page number display
   const pageNumberDisplay = document.getElementById('pageNumber');
   if (pageNumberDisplay) {
       pageNumberDisplay.textContent = `Page ${currentPage}`;
   }

  createPaginationControls();
}


// Pagination buttons to navigate through pages
function createPaginationControls() {
  const paginationContainer = document.getElementById('paginationControls');

  // Clear any existing controls
  paginationContainer.innerHTML = '';

  // Create Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1; // Disable if on the first page
  prevButton.addEventListener('click', () => handlePageChange(-1));
  
  // Create Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => handlePageChange(1));
  
  // Append buttons to pagination container
  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(nextButton);
}


// Fetch genres and populate genreMap
async function fetchAndBuildGenreMap() {
    try {
      const response = await fetch(genreApiUrl); 
      if(!response.ok) {
        throw new Error(`Failed to fecth genre. HTTP status: ${response.status}`);
      }
    
    const data = await response.json();
      if (data.genres && Array.isArray(data.genres)) {
        // Build the genreMap dynamically
        genreMap = data.genres.reduce((map, genre) => {
          map[genre.name.toLowerCase().replace(/\s+/g, '_')] = genre.id;
          return map;
        }, {});

        console.log("Genre Map:", genreMap); // generated genreMap

        createGenreButtons(); // Create buttons dynamically once genres are loaded
      } else {
        displayError("No genres found in the API response.");
      }
  } catch (error) {
    console.error("Error fetching genres:", error);
    displayError("Error fetching genres:");
  }
}


  function createGenreButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ""; // Clear any existing buttons
  
    Object.keys(genreMap).forEach(genreKey => {
      const genreName = genreKey.replace(/_/g, ' ');
      const genreId = genreMap[genreKey];
      console.log(`Creating button for Genre: ${genreName}, ID: ${genreId}`);

      const button = document.createElement('button');
      button.textContent = genreName;
      button.onclick = () => filterMoviesByGenre(genreId, genreName) // Attach click handler
      buttonContainer.appendChild(button);
    });
  }


// Filter movies by genre 
async function filterMoviesByGenre(genreId, genreName) {

  currentPage = 1; // Reset pagination
  totalMoviesLoaded = 0; // Reset total movies loaded
  currentMode = genreId; // Switch mode to genre

  const genreType = document.getElementById('genreType');
  genreType.textContent = `Genre: ${genreName}`;

  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ""; // Clear the movie list

  const pageNumberDisplay = document.getElementById('pageNumber'); // Update the page number display
    if (pageNumberDisplay) {
        pageNumberDisplay.textContent = `Page ${currentPage}`;
    }

  await fetchMoviesByGenre(genreId, currentPage); // Fetch movies for the selected genre
} 


// Reset to top-rated movies
async function showTopRatedMovies() {
  currentPage = 1; // Reset pagination
  totalMoviesLoaded = 0; // Reset total movies loaded
  currentMode = "topRated"; // Switch mode to top-rated

  const genreType = document.getElementById('genreType');
  genreType.textContent = "Top-Rated Movies";

  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ""; // Clear the movie list

  await fetchTopRatedMovies(currentPage); // Fetch top-rated movies
}

// Function to display movie details when clicked
function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    
    showLoading(); // Show loading indicator
    
    try {
    // Construct poster URL
    const posterUrl =  `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const image = document.createElement('img')
    image.src = posterUrl;
    image.alt = `${movie.title} poster`;

    // Display movie title and overview
    const title = document.createElement('h3');
    title.textContent = movie.title;
  
    const overview = document.createElement('p');
    overview.textContent = movie.overview;
  
    // Append the details to the movieDetails section
    movieDetails.innerHTML = "";
    movieDetails.appendChild(image);
    movieDetails.appendChild(title);
    movieDetails.appendChild(overview);
  } catch {
    displayError("Failed to load movie details. Please try again.");
    console.error("Error displaying movie details:", error);
  } finally {
    hideLoading(); // Hide loading indicator
}
}

// Function to search movies by title
async function searchMoviesByTitle(query) {
  console.log(`Searching for movies with title: ${query}`); // Debug log
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${currentPage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies for the title. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      displayMovies(data.results); // Display the movies from the search result
    } else if (!data.results || data.results.length === 0) {
      displayError("No matches found for your search.");
    }
  } catch (error) {
    console.error("Error fetching movies by title:", error);
  }
}


// Function to handle search input
function handleSearchInput(event) {
  const query = event.target.value.trim();

  // Clear the error message container
  const errorMessageContainer = document.getElementById('errorMessageContainer');
  errorMessageContainer.innerHTML = ''; // Clear existing error message
  
  // If the input is not empty, perform the search
  if (query) {
    console.log("Searching for movies with title:", query);
    searchMoviesByTitle(query);
  } else {
    // If the input is empty, reset to show top-rated movies
    console.log("Search input cleared. Resetting to top-rated movies.");
    showTopRatedMovies();
  } 
}

// Attach the search input event listener to the search bar
document.getElementById('searchBar').addEventListener('input', handleSearchInput);


// Function to display error messages
async function displayError(message, delay = 0) {
  const movieList = document.getElementById('errorMessageContainer');

  if (!movieList) {
    console.error("Error: 'errorMessageContainer' element not found!");
    return;
  }

  movieList.innerHTML = ""; // Clear any existing content

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;
  errorMessage.style.color = 'red';
  movieList.appendChild(errorMessage);
  console.log(`Error message displayed: ${message}`); // Debug log
}

// loading indicator
function showLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
  }
}
function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
  }
}


  // Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  showTopRatedMovies();
  fetchAndBuildGenreMap();
  fetchInitialMovies();
  createPaginationControls(); 
});


