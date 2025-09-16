async function loadShows() {
  const res = await fetch("shows.json");
  return await res.json();
}

// Dynamically populate genre dropdown
function displayGenres(shows) {
  const genreFilter = document.getElementById("genreFilter");
  const genres = [...new Set(shows.map(show => show.genre))];

  genreFilter.innerHTML = '<option value="">All Genres</option>';
  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Display shows as colorful cards
function displayShows(shows, query = "", genre = "", sort = "title") {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  let filtered = shows.filter(show =>
    show.title.toLowerCase().includes(query.toLowerCase()) ||
    show.creator.toLowerCase().includes(query.toLowerCase())
  );

  if (genre) {
    filtered = filtered.filter(show => show.genre === genre);
  }

  if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "year") {
    filtered.sort((a, b) => a.year - b.year);
  }

  if (filtered.length === 0) {
    resultsDiv.innerHTML = `
      <div class="col-span-full text-center">
        <img src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif" class="mx-auto w-40 mb-2">
        <p class='text-gray-600 text-lg'>No shows found!</p>
      </div>`;
    return;
  }

  filtered.forEach(show => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition transform duration-200";
    card.innerHTML = `
      <img src="${show.poster}" alt="${show.title}" class="w-full h-64 object-cover rounded-xl mb-3 shadow-md">
      <h2 class="text-xl font-bold text-gray-800">${show.title}</h2>
      <p class="text-sm text-gray-600 mb-2">${show.creator} • ${show.year}</p>
      <span class="text-xs px-3 py-1 bg-blue-200 text-blue-800 rounded-full">${show.genre}</span>
    `;
    resultsDiv.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const shows = await loadShows();
  displayGenres(shows);

  const searchInput = document.getElementById("search");
  const genreFilter = document.getElementById("genreFilter");
  const sortBy = document.getElementById("sortBy");

  function updateDisplay() {
    displayShows(shows, searchInput.value, genreFilter.value, sortBy.value);
  }

  searchInput.addEventListener("input", updateDisplay);
  genreFilter.addEventListener("change", updateDisplay);
  sortBy.addEventListener("change", updateDisplay);

  updateDisplay();
});
