// Get HTML DOM Element Reference
const form = document.getElementById("songForm");
const list = document.getElementById("songList");
const submitBtn = document.getElementById("submitBtn");

const toggleViewBtn = document.getElementById("toggleViewBtn");
const cardsView = document.getElementById("cardsView");
const table = document.querySelector("table");

document.querySelectorAll('input[name="sortBy"]').forEach((radio) => {
  radio.addEventListener("change", renderSongs);
});

// User click on view style button
toggleViewBtn.addEventListener("click", () => {
  const isCards = !cardsView.classList.contains("d-none");

  if (isCards) {
    // Change to cards view
    cardsView.classList.add("d-none");
    table.classList.remove("d-none");
    toggleViewBtn.textContent = "Cards View";
  } else {
    // Change to table view
    cardsView.classList.remove("d-none");
    table.classList.add("d-none");
    toggleViewBtn.textContent = "Table View";
  }

  renderSongs();
});

// if not exists in localStorage get empty array.
// get json text and convert it to object json
let songs = JSON.parse(localStorage.getItem("songs")) || [];
window.onload = () => renderSongs();

// User click the 'Add' button
form.addEventListener("submit", async (e) => {
  // Dont submit the form to the server yet. let me handle it here
  e.preventDefault();

  // Read Forms Data
  const id = document.getElementById("songId").value;
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const rating = Number(document.getElementById("rating").value);

  const youtubeID = extractYouTubeID(url);
  if (!youtubeID) {
    alert("Invalid YouTube URL");
    return;
  }
  const youtubeTitle = await fetchYouTubeTitle(youtubeID);
  const thumbnail = `https://img.youtube.com/vi/${youtubeID}/0.jpg`;

  // create JSON OBJ from form data
  if (id) {
    // Edit the song
    const song = songs.find((s) => s.id == id);
    song.youtubeID = youtubeID;
    song.title = title;
    song.youtubeTitle = youtubeTitle;
    song.url = url;
    song.rating = rating;
    song.thumbnail = thumbnail;
  } else {
    // Add new Song
    songs.push({
      id: Date.now(),
      youtubeID,
      title,
      youtubeTitle,
      url,
      rating,
      thumbnail,
      dateAdded: Date.now(),
    });
  }

  saveAndRender();
  //TO DO SAVE  AND RERENDER

  form.reset();
});

// Save to Local storage and render UI Table
function saveAndRender() {
  localStorage.setItem("songs", JSON.stringify(songs));
  // TODO RELOAD UI
  renderSongs();
}

function renderSongs() {
  const sortValue = document.querySelector(
    'input[name="sortBy"]:checked'
  ).value;

  songs.sort((a, b) => {
    if (sortValue === "title") return a.title.localeCompare(b.title);
    if (sortValue === "rating") return (b.rating || 0) - (a.rating || 0);
    return b.dateAdded - a.dateAdded;
  });

  list.innerHTML = "";
  cardsView.innerHTML = "";

  songs.forEach((song) => {
    // Table view
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${song.title}</td>
      <td>${song.youtubeTitle}</td>
      <td><img src="${song.thumbnail}" width="80" class="rounded"></td>
      <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
      <td>${song.rating}</td>
      <td class="text-end">
          <button class="btn btn-sm btn-info me-2" onclick="playSong('${song.youtubeID}')">
              <i class="fas fa-play"></i>
          </button>
          <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
              <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
              <i class="fas fa-trash"></i>
          </button>
      </td>
    `;
    list.appendChild(row);

    // Cards view
    const card = document.createElement("div");
    card.classList.add("col-md-3", "mb-3");

    card.innerHTML = `
      <div class="card h-100">
        <img src="${song.thumbnail}" class="card-img-top" onclick="playSong('${song.youtubeID}')" style="cursor:pointer">
        <div class="card-body">
          <h5 class="card-title">${song.title}</h5>
          <p class="card-text">Rating: ${song.rating}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-sm btn-info me-2" onclick="playSong('${song.youtubeID}')">
            <i class="fas fa-play"></i>
          </button>
          <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
    cardsView.appendChild(card);
  });
}

function editSong(id) {
  const song = songs.find((s) => s.id === id);

  document.getElementById("songId").value = song.id;
  document.getElementById("title").value = song.title;
  document.getElementById("url").value = song.url;
  document.getElementById("rating").value = song.rating;
}

function extractYouTubeID(url) {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }

  return null;
}

async function fetchYouTubeTitle(videoID) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoID}&format=json`
    );
    const data = await res.json();
    return data.title;
  } catch (err) {
    return "Unknown Title";
  }
}

function playSong(youtubeID) {
  const frame = document.getElementById("playerFrame");
  frame.src = `https://www.youtube.com/embed/${youtubeID}?autoplay=1`;

  const modal = new bootstrap.Modal(document.getElementById("playerModal"));
  modal.show();

  document
    .getElementById("playerModal")
    .addEventListener("hidden.bs.modal", () => {
      frame.src = "";
    });
}

function deleteSong(id) {
  if (confirm("Are you sure?")) {
    // Filter out the song with the matching ID
    songs = songs.filter((song) => song.id !== id);
    saveAndRender();
  }
}
