const apiKey = "4291752680fb18b8f286cc679c1e1d8e";
const baseUrl =  "https://api.themoviedb.org/3"; //`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const genreApiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

let currentPage = 1; // Track the current page
const moviesPerPage = 10; // Number of movies to load per page
let currentMode = 'topRated'; // switching between modes for pagination 
let totalMoviesLoaded = 0; // Track the total number of movies loaded

// Function to fetch top-rated movies
async function fetchTopRatedMovies(page) {
  const url = `${baseUrl}/movie/top_rated?api_key=${apiKey}&page=${page}`;
  console.log(`Fetching top-rated movies from: ${url}`); // Log the URL being fetched

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      displayMovies(data.results);
    } else {
      displayError("No top-rated movies found. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to fetch movies by genre with pagination
async function fetchMoviesByGenre(genreId, page) {
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;

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
  }
}

// Function to display movies on the page
function displayMovies(movies) {
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = '';

   // Check if movies are being passed correctly
   console.log("Movies to display:", movies); // Log the movies being displayed

  // Append the fetched movies as list items
  movies.forEach(movie => {
    const movieItem = document.createElement('li');
    movieItem.textContent = `${movie.title} (rating: ${movie.vote_average})`;
    movieItem.addEventListener('click', () => {
      displayMovieDetails(movie); // Click handler for displaying details
    });
    movieList.appendChild(movieItem);
  });

  // Update the total movies loaded
  totalMoviesLoaded += movies.length;
}

// Function to load initial movies
async function fetchInitialMovies() {
  console.log("Fetching initial top-rated movies..."); // Log when fetching initial movies
  await fetchTopRatedMovies(currentPage);
}


// Function to handle page change (Previous/Next)
function handlePageChange(increment) {
  currentPage += increment;
  if (currentMode === 'topRated') {
    fetchTopRatedMovies(currentPage);
  } else {
    fetchMoviesByGenre(currentMode, currentPage);
  }

  // Update page number display
  // const pageNumberDisplay = document.getElementById('pageNumber');
  // pageNumberDisplay.textContent = `Page ${currentPage}`;
}

// function handlePagination(page) {
//   // Fetch movies for the current page
//   if (currentMode === 'topRated') {
//     fetchTopRatedMovies(page);
//   } else {
//     fetchMoviesByGenre(currentMode, page);
//   }

//   // Scroll the page to the top after updating the movie list
//   const movieList = document.getElementById('movieList');
//   movieList.scrollIntoView({ behavior: 'smooth', block: 'start' });
// }

// Pagination buttons to navigate through pages
function createPaginationControls() {
  const paginationContainer = document.getElementById('paginationControls');

  // Clear any existing controls
  paginationContainer.innerHTML = '';

  // Create Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  // prevButton.disabled = currentPage === 1; // Disable if on the first page
  prevButton.addEventListener('click', () => handlePageChange(-1));
  // prevButton.onclick = () => {
  //   if (currentPage > 1) {
  //     currentPage--;
  //     handlePagination(currentPage);
  //   }
  // };
  
  // Create Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => handlePageChange(1));
  // nextButton.onclick = () => {
  //   if (totalMoviesLoaded >= moviesPerPage) {
  //     currentPage++;
  //     handlePagination(currentPage);
  //   }
  // };
  
  // Append buttons to pagination container
  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(nextButton);
}

let genreMap = {};

// Fetch genres and populate genreMap
async function fetchAndBuildGenreMap() {
  // fetch(genreApiUrl)
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
      // button.textContent = genre.replace(/_/g, ' ');
      button.onclick = () => filterMoviesByGenre(genreId, genreName)//(genreMap[genre]); // Attach click handler
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
    
    // Clear any previous details
    movieDetails.innerHTML = '<p>Loading...</p>';
    
    try {
    // Construct poster URL
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

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
  }
}

// Function to search movies by title
async function searchMoviesByTitle(query) {
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${currentPage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies for the title. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      displayMovies(data.results); // Display the movies from the search result
    } else {
      displayError("No matches found for your search.");
    }
  } catch (error) {
    console.error("Error fetching movies by title:", error);
  }
}

// Function to handle search input
function handleSearchInput(event) {
  const query = event.target.value.trim();
  
  // If the input is not empty, perform the search
  if (query) {
    searchMoviesByTitle(query);
  } else {
    // If the input is empty, reset to show top-rated movies
    showTopRatedMovies();
  }
}

// Attach the search input event listener to the search bar
document.getElementById('searchBar').addEventListener('input', handleSearchInput);

// Function to display error messages
async function displayError(message, delay = 0) {
  const movieList = document.getElementById('errorMessageContainer');
  movieList.innerHTML = ""; // Clear any existing content

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;
  errorMessage.style.color = 'red';
  movieList.appendChild(errorMessage);
}

  // Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  showTopRatedMovies();
  fetchAndBuildGenreMap();
  fetchInitialMovies();

  // const movieSection = document.getElementById('movieSection');
  // movieSection.addEventListener('scroll', handleScroll); 

  createPaginationControls(); // Initialize pagination controls
});

// function searchTitle() {}
