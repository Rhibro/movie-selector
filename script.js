const apiKey = "4291752680fb18b8f286cc679c1e1d8e";
const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;


const genreMap = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    drama: 18,
    family: 10751,
    fantasy: 14,
    romance: 10749,
    thriller: 53,
    sci_fi: 878
  };

  function createGenreButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
  
    Object.keys(genreMap).forEach(genre => {
      const button = document.createElement('button');
      button.textContent = genre;
      button.onclick = () => filterMoviesByGenre(genreMap[genre]); // Attach click handler
      buttonContainer.appendChild(button);
    });
  }

function filterMoviesByGenre(genreId) {

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const filteredMovies = data.results.filter(movie => movie.genre_ids.includes(genreId)); // Filter movies
      console.log(`Movies with Genre ID ${genreId}:`, filteredMovies);

      // Display movies on the page
      const movieList = document.getElementById('movieList');
      movieList.innerHTML = ""; // Clear previous results
      filteredMovies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.title} (rating: ${movie.popularity}%)`;
        movieItem.addEventListener('click', () => {
            displayMovieDetails(movie);
          });
        movieList.appendChild(movieItem);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
} 

// Function to display movie details when clicked
function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    
    // Clear any previous details
    movieDetails.innerHTML = "";
    
    const image = document.createElement('div')
    image.innerHTML = `<img src="${posterUrl}" alt="${movie.title} poster" />`
    // Display movie title and overview
    const title = document.createElement('h3');
    title.textContent = movie.title;
  
    const overview = document.createElement('p');
    overview.textContent = movie.overview;
  
    // Append the details to the movieDetails section
    movieDetails.appendChild(title);
    movieDetails.appendChild(overview);
  }

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
