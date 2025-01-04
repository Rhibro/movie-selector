const apiKey = "4291752680fb18b8f286cc679c1e1d8e";
const baseUrl =  "https://api.themoviedb.org/3"; //`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const genreApiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

let currentPage = 1; // Track the current page
const moviesPerPage = 10; // Number of movies to load per page
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
      console.log("API Response:", data);
      if (data.results && Array.isArray(data.results)) {
        displayMovies(data.results);
      } else {
        console.error("No results found in the API response.");
      }
    } catch(error) { 
      console.error("Error fetching movies:", error);
    }
}

// Function to display movies on the page
function displayMovies(movies) {
  const movieList = document.getElementById('movieList');

   // Check if movies are being passed correctly
   console.log("Movies to display:", movies); // Log the movies being displayed
  
  // Append only the first 10 movies from the fetched results
  const moviesToDisplay = movies.slice(0, moviesPerPage);
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
}

// Function to load initial movies
async function fetchInitialMovies() {
  // console.log("Fetching initial top-rated movies..."); // Log when fetching initial movies
  movieList.innerHTML = "Fetching initial top-rated movies...";
  movieList.innerHTML = '';
  await fetchTopRatedMovies(currentPage);
}

// Function to handle scroll event for pagination
function handleScroll() {
  const movieSection = document.getElementById('movieSection');
  const scrollPosition = movieSection.scrollTop + movieSection.clientHeight;
  const threshold = movieSection.scrollHeight - 200; // Load more when near the bottom

  if (scrollPosition >= threshold && totalMoviesLoaded % moviesPerPage === 0) {
    currentPage++; // Increment the page number
    fetchTopRatedMovies(currentPage); // Fetch more movies
  }
}

let genreMap = {};

// Fetch genres and populate genreMap
async function fetchAndBuildGenreMap() {
  fetch(genreApiUrl)
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
        throw new Error("No genres found in the API response.");
      }
  } catch (error) {
    console.error("Error fetching genres:", error);
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
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
  const movieList = document.getElementById('movieList'); // Top-rated movies container
  const filteredMovieList = document.getElementById('filteredMovies'); // Filtered movies container
  const genreType = document.getElementById('genreType');

  try {

    // Update the genreType element to display the selected genre
    genreType.textContent = `Genre: ${genreName}`;
     // Clear both lists to avoid overlap
     movieList.innerHTML = "";
     filteredMovieList.innerHTML = "";

    const response = await fetch(url)
    if (!response.ok){
      throw new Error(`Failed to fetch movies by genre. HTTP Status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      // const filteredMovies = document.getElementById('filteredMovies'); 
      // filteredMovies.innerHTML = '';
      // // console.log(`Movies with Genre ID ${genreId}: movieList`);

      // Display movies on the page
      data.results.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.title} (rating: ${movie.vote_average})`;
        movieItem.addEventListener('click', () => {
            displayMovieDetails(movie);
          });
        filteredMovieList.appendChild(movieItem);
      });
    } else {
      throw new Error("No results found in the API response.");
    }
  } catch (error) {
    movieList.innerHTML = "Unable to fetch movies for the selected genre. Please try again later.";
    console.error("Error fetching data:", error);
  }
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
    movieDetails.innerHTML = "<p>Failed to load movie details. Please try again.</p>";
    console.error("Error displaying movie details:", error);
  }
}

  // Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  fetchInitialMovies(); // Fetch initial movies on page load
  fetchAndBuildGenreMap();
  const movieSection = document.getElementById('movieSection');
  movieSection.addEventListener('scroll', handleScroll); // Add scroll event listener to movieSection
});

filterMoviesByGenre();
// createGenreButtons();

// function displayMovies() {}


// function searchTitle() {}
