const API = "http://localhost:5000/api/projects";
const token = localStorage.getItem("token");

/* =========================
   AUTH CHECK
========================= */
if (!token) {
  window.location.href = "index.html";
}

/* =========================
   GET PROJECT ID
========================= */
const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {
  alert("Invalid project");
  window.location.href = "dashboard.html";
}

/* =========================
   LOAD PROJECT
========================= */
document.addEventListener("DOMContentLoaded", loadProject);

async function loadProject() {
  try {
    const res = await fetch(`${API}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Project not found");

    const project = await res.json();

    document.getElementById("projectName").innerText = project.name;
    document.getElementById("projectDeadline").innerText =
      new Date(project.deadline).toDateString();

    const statusEl = document.getElementById("projectStatus");
    statusEl.innerText = project.status;
    statusEl.className = `badge ${project.status}`;

    document.getElementById("projectDescription").innerText =
      project.description || "No description provided";

  } catch (err) {
    alert("Failed to load project");
    console.error(err);
  }
}

/* =========================
   ACTIONS
========================= */
async function markCompleted() {
  await fetch(`${API}/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: "COMPLETED" })
  });

  loadProject();
}

async function deleteProject() {
  if (!confirm("Archive this project?")) return;

  await fetch(`${API}/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  window.location.href = "dashboard.html";
}

/* =========================
   NAV
========================= */
function goBack() {
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
