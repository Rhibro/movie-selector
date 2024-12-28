const apiKey = "4291752680fb18b8f286cc679c1e1d8e";
const baseUrl =  "https://api.themoviedb.org/3"; //`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const genreApiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

let genreMap = {};

// Fetch genres and populate genreMap
function fetchAndBuildGenreMap() {
  fetch(genreApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.genres && Array.isArray(data.genres)) {
        // Build the genreMap dynamically
        genreMap = data.genres.reduce((map, genre) => {
          map[genre.name.toLowerCase().replace(/\s+/g, '_')] = genre.id;
          return map;
        }, {});

        console.log("Genre Map:", genreMap); // Optional: View the generated genreMap
        createGenreButtons(); // Create buttons dynamically once genres are loaded
      } else {
        console.error("No genres found in the API response.");
      }
    })
    .catch(error => console.error("Error fetching genres:", error));
}

  function createGenreButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ""; // Clear any existing buttons
  
    Object.keys(genreMap).forEach(genre => {
      const button = document.createElement('button');
      button.textContent = genre.replace(/_/g, ' ');
      button.onclick = () => filterMoviesByGenre(genreMap[genre]); // Attach click handler
      buttonContainer.appendChild(button);
    });
  }

function filterMoviesByGenre(genreId) {
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

  fetch(url)
    .then(response => response.json())
    .then(data => { 
      console.log("API Response:", data);

      if (data.results && Array.isArray(data.results)){
      const filteredMovies = data.results; // Filter movies
      console.log(`Movies with Genre ID ${genreId}:`, filteredMovies);

      // Display movies on the page
      const movieList = document.getElementById('movieList');
      movieList.innerHTML = ""; // Clear previous results
      filteredMovies.forEach((movie) => {
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.title} (rating: ${movie.vote_average})`;
        movieItem.addEventListener('click', () => {
            displayMovieDetails(movie);
          });
        movieList.appendChild(movieItem);
      });
    } else {
      console.error("No results found in the API response.");
    }
    })
    .catch(error => console.error("Error fetching data:", error));
} 

// Function to display movie details when clicked
function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    
    // Clear any previous details
    movieDetails.innerHTML = '<p>Loading...</p>';
    
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
  }

  // Initialize genre buttons on page load
  document.addEventListener("DOMContentLoaded", fetchAndBuildGenreMap);

filterMoviesByGenre();
createGenreButtons();

// function displayMovies() {}

// function movieDetails() {

//     movieItem.addEventListener('click', () => {
//         movieDetail.innerHTML = '';
//         movieDetail.innerHTML = '<p>Loading...</p>';

//         fetch(movie.overview)
//     })

// }

// function searchTitle() {}
