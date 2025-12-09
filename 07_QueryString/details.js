// Create object for Query Params
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const mode = params.get("mode");

let songs = JSON.parse(sessionStorage.getItem("songs"));

const out = document.getElementById("content");

if (!songs) {
  out.innerHTML = `
    <div class="alert alert-danger">
      Session data not found – return to list page.
    </div>
  `;
  throw "";
}

const song = songs.find((s) => s.id === id);

if (!song) {
  out.innerHTML = `
    <div class="alert alert-warning">
      Song not found
    </div>
  `;
  throw "";
}

if (mode === "view") {
  out.innerHTML = `
    <div class="card shadow">
      <div class="card-body">

        <h4>${song.title}</h4>
        <h6 class="text-muted">${song.artist}</h6>

        <p>
          <b>Year:</b> ${song.year}
        </p>

        <a href="details.html?id=${song.id}&mode=edit"
           class="btn btn-warning">
          ✏️ Edit
        </a>

      </div>
    </div>
  `;
}

if (mode === "edit") {
  out.innerHTML = `
  <div class="card shadow">
    <div class="card-body">

      <h4>Edit Song</h4>

      <div class="mb-3">
        <label class="form-label">Title</label>
        <input id="title" class="form-control"
               value="${song.title}">
      </div>

      <div class="mb-3">
        <label class="form-label">Artist</label>
        <input id="artist" class="form-control"
               value="${song.artist}">
      </div>

      <div class="mb-3">
        <label class="form-label">Year</label>
        <input id="year" type="number"
               class="form-control"
               value="${song.year}">
      </div>

      <button class="btn btn-success"
              onclick="save()">
        💾 Save
      </button>

    </div>
  </div>
  `;
}

function save() {
  song.title = document.getElementById("title").value;
  song.artist = document.getElementById("artist").value;
  song.year = document.getElementById("year").value;

  sessionStorage.setItem("songs", JSON.stringify(songs));

  location.href = `details.html?id=${song.id}&mode=view`;
}
