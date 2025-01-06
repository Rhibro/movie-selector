# The Movie Selector
"The Movie Selector" is a dynamic web application that allows users to explore movies, search by title, filter by genre, and view detailed information about each movie. The project is powered by The Movie Database (TMDb) API and emphasizes asynchronous operations, user experience, and responsive design.

Instructions to run it locally:
1. Clone gitrepo: git clone https://github.com/your-username/the-movie-collector.git
2. Navigate to the Project Directory: cd movie-selector
3. Open the application: run in VScode live server

<h2>Project Features</h2>

View Movies: Displays a list of top-rated movies by default.

Search by Title: Enter a movie title in the search bar to find matching movies.

Filter by Genre: Dynamically generated buttons allow filtering by specific genres.

View Movie Details: Click a movie to view its title, description, and poster.

Pagination: Navigate through multiple pages of movies with "Next" and "Previous" buttons.

Responsive Design: Optimized for mobile, tablet, and desktop devices.

Error Handling: Clear error messages for invalid searches, network issues, or unexpected API responses.

<h2>Figma Design</h2>
https://www.figma.com/design/fCCvWAhkVEAq9980ws9Kwb/Movie-Selector?node-id=0-1&p=f&t=Ma6SzbBMMwSfb2W7-0

<h2>JSON and HTTP/HTTPS</h2>
API Used: The Movie Database (TMDb)
Endpoints:
 
 Top-Rated Movies: https://api.themoviedb.org/3/movie/top_rated

 Genres List: https://api.themoviedb.org/3/genre/movie/list
 
 Search by Title: https://api.themoviedb.org/3/search/movie
 
 Movies by Genre: https://api.themoviedb.org/3/discover/movie

API Key: A unique API key is required to authenticate requests

Parameters:

 page: Current page for pagination.

 with_genres: Genre ID for filtering movies.
 
 query: Search query for finding movies by title.

<h2> Asynchronous Operations</h2>
Fetch Operations: All data fetching is performed using fetch with async/await.

Error Handling:
 Used try/catch blocks to handle network errors and unexpected API responses.
 Provided user-friendly error messages via the displayError function.

<h2>UX/UI Considerations</h2>
WCAG Compliance:

 Alt text for images.

 Semantic HTML structure with proper headings and containers.
 
 Sufficient color contrast for readability.

Feedback Mechanisms:
 
 Loading indicators while fetching movie details.
 
 Clear feedback for invalid searches or empty genres.

Lighthouse test showed 100% on accessibility 
Wave test showed no errors, contrast issues, or alerts.  

Responsive Design:
 Layout adapts seamlessly to different screen sizes.

<h2>How to Navigate and Use the Application</h2>
Home Page:
Automatically displays top-rated movies with pagination controls.
Navigate using the "Next" and "Previous" buttons.

Search Movies:
Type in the search bar to look for movies by title.
The results update dynamically as you type.

Filter by Genre:
Genre buttons appear at the top of the page.
Click a button to filter movies for that genre.

View Movie Details:
Click any movie in the list to view its details, including:
Poster
Title
Overview (short description)

Error Handling:
If an issue occurs (e.g., no results found or network error), a clear message will display at the top of the page.


