const form = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const bioInput = document.getElementById("bio");
const skillsInput = document.getElementById("skills");
const githubInput = document.getElementById("github");
const linkedinInput = document.getElementById("linkedin");
const instagramInput = document.getElementById("instagram");

function updatePreview() {
  const name = nameInput.value.trim() || "Your Name";
  const bio = bioInput.value.trim() || "Your bio will appear here.";
  const skills = skillsInput.value.split(",").map(x => x.trim()).filter(Boolean);

  document.getElementById("cardName").textContent = name;
  document.getElementById("cardBio").textContent = bio;
  document.getElementById("avatar").textContent = name.charAt(0).toUpperCase();

  const skillsBox = document.getElementById("cardSkills");
  skillsBox.innerHTML = "";

  if (skills.length === 0) {
    const span = document.createElement("span");
    span.textContent = "Add skills";
    skillsBox.appendChild(span);
  } else {
    skills.forEach(skill => {
      const span = document.createElement("span");
      span.textContent = skill;
      skillsBox.appendChild(span);
    });
  }

  const linksBox = document.getElementById("cardLinks");
  linksBox.innerHTML = "";

  [
    ["GitHub", githubInput.value],
    ["LinkedIn", linkedinInput.value],
    ["Instagram", instagramInput.value]
  ].forEach(([label, url]) => {
    if (url.trim()) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = label;
      linksBox.appendChild(a);
    }
  });
}

[ nameInput, bioInput, skillsInput, githubInput, linkedinInput, instagramInput ]
  .forEach(input => input.addEventListener("input", updatePreview));

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "Saving profile...";

  const data = {
    name: nameInput.value,
    bio: bioInput.value,
    skills: skillsInput.value,
    github: githubInput.value,
    linkedin: linkedinInput.value,
    instagram: instagramInput.value
  };

  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Failed");

    status.textContent = "✅ Profile saved successfully!";
    loadProfiles();
  } catch (error) {
    status.textContent = "❌ " + error.message;
  }
});

async function loadProfiles() {
  const box = document.getElementById("savedProfiles");

  try {
    const response = await fetch("/api/profiles");
    const profiles = await response.json();

    box.innerHTML = "";

    if (!profiles.length) {
      box.innerHTML = "<p>No profiles saved yet.</p>";
      return;
    }

    profiles.forEach(profile => {
      const div = document.createElement("div");
      div.className = "saved-card";

      const title = document.createElement("h3");
      title.textContent = profile.name;

      const bio = document.createElement("p");
      bio.textContent = profile.bio || "No bio";

      const skills = document.createElement("small");
      skills.textContent = "Skills: " + (profile.skills || "None");

      div.append(title, bio, skills);
      box.appendChild(div);
    });
  } catch {
    box.innerHTML = "<p>Could not load saved profiles.</p>";
  }
}

updatePreview();
loadProfiles();