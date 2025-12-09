const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Static folder is client folder
app.use(express.static(path.join(__dirname, "client")));

const songs = [
  { id: 1, title: "Skyfall", artist: "Adele", length: 285 },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", length: 200 },
  { id: 3, title: "Numb", artist: "Linkin Park", length: 185 },
];

// GET - החזרת כל השירים
app.get("/api/songs", (req, res) => {
  res.json(songs);
});

// GET - החזרת שיר לפי ID
app.get("/api/songs/:id", (req, res) => {
  const id = Number(req.params.id);
  const song = songs.find((s) => s.id === id);

  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }

  res.json(song);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
