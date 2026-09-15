const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
const db = new sqlite3.Database("./profiles.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT,
      skills TEXT,
      github TEXT,
      linkedin TEXT,
      instagram TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.post("/api/profile", (req, res) => {
  const { name, bio, skills, github, linkedin, instagram } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }

  const cleanSkills = (skills || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .join(", ");

  const sql = `
    INSERT INTO profiles (name, bio, skills, github, linkedin, instagram)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name.trim(), bio || "", cleanSkills, github || "", linkedin || "", instagram || ""],
    function (err) {
      if (err) return res.status(500).json({ error: "Could not save profile." });

      res.json({
        id: this.lastID,
        name: name.trim(),
        bio: bio || "",
        skills: cleanSkills,
        github: github || "",
        linkedin: linkedin || "",
        instagram: instagram || ""
      });
    }
  );
});

app.get("/api/profiles", (req, res) => {
  db.all("SELECT * FROM profiles ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Could not load profiles." });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
