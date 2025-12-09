const songsTableBody = document.querySelector("#songsTable tbody");
const songForm = document.getElementById("songForm");
const songIdInput = document.getElementById("songId");
const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");
const yearInput = document.getElementById("year");
const fileInput = document.getElementById("file");

const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchBtn = document.getElementById("searchBtn");
const searchArtistInput = document.getElementById("searchArtist");
const searchMinYearInput = document.getElementById("searchMinYear");
const searchMaxYearInput = document.getElementById("searchMaxYear");

let isEditing = false;

// Call /api/songs
async function loadSongs() {
  const res = await fetch("/api/songs");
  const songs = await res.json();
  renderSongs(songs);
}

function renderSongs(songs) {
  songsTableBody.innerHTML = "";

  songs.forEach((song) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${song.id}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.year}</td>
            <td>
                ${
                  song.mp3
                    ? `<audio controls src="${song.mp3}"></audio>`
                    : `<span class="text-muted">No file</span>`
                }
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-2" data-action="edit" data-id="${
                  song.id
                }">Edit</button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-id="${
                  song.id
                }">Delete</button>
            </td>
        `;

    songsTableBody.appendChild(tr);
  });
}

songForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const songData = {
    title: titleInput.value,
    artist: artistInput.value,
    year: yearInput.value,
  };

  if (!isEditing) {
    // CREATE
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songData),
    });
    if (!res.ok) {
      alert("Error creating song");
    }
  } else {
    // UPDATE
    const id = songIdInput.value;
    const res = await fetch(`/api/songs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songData),
    });
    if (!res.ok) {
      alert("Error updating song");
    }
  }

  clearForm();
  loadSongs();
});

function clearForm() {
  isEditing = false;
  songIdInput.value = "";
  titleInput.value = "";
  artistInput.value = "";
  yearInput.value = "";
  fileInput.value = ""; // will matter later
}

loadSongs();
