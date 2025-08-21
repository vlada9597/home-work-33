const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

const API_KEY = "20e3a2bb"; 

let currentQuery = "";
let currentPage = 1;
let totalResults = 0;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    currentQuery = query;
    currentPage = 1;
    fetchMovies(query, currentPage, true);
  } else {
    resultsContainer.innerHTML = "";
  }
});

async function fetchMovies(query, page = 1, reset = false) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`);
    if (!response.ok) throw new Error("Помилка запиту");

    const data = await response.json();

    if (data.Response === "True") {
      totalResults = parseInt(data.totalResults); // загальна кількість результатів
      displayMovies(data.Search, reset);
      toggleLoadMoreButton();
    } else {
      resultsContainer.innerHTML = `<p>Нічого не знайдено 😢</p>`;
      hideLoadMoreButton();
    }
  } catch (error) {
    resultsContainer.innerHTML = `<p class="error">Помилка: ${error.message}</p>`;
    hideLoadMoreButton();
  }
}

function displayMovies(movies, reset = false) {
  if (reset) resultsContainer.innerHTML = "";

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie");

    movieCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150"}" alt="${movie.Title}">
      <div class="movie-info">
        <h2>${movie.Title}</h2>
        <p>Рік: ${movie.Year}</p>
        <p>Тип: ${movie.Type}</p>
      </div>
    `;

    resultsContainer.appendChild(movieCard);
  });
}

// показати/сховати кнопку
function toggleLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMore");

  // кількість уже завантажених результатів
  const loaded = currentPage * 10;

  if (loaded < totalResults) {
    if (!loadMoreBtn) {
      createLoadMoreButton();
    }
  } else {
    hideLoadMoreButton();
  }
}

function createLoadMoreButton() {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.id = "loadMore";
  loadMoreBtn.textContent = "Завантажити більше";
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    fetchMovies(currentQuery, currentPage);
  });
  resultsContainer.appendChild(loadMoreBtn);
}

function hideLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMore");
  if (loadMoreBtn) {
    loadMoreBtn.remove();
  }
}
