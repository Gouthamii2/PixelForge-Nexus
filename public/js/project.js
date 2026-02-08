const STORAGE_KEY = "pixelforge_projects";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);
const projectId = Number(params.get("id"));

let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let project = projects.find(p => p.id === projectId);

if (!project) {
  alert("Project not found");
  window.location.href = "dashboard.html";
}

/* ======================
   LOAD PROJECT
====================== */
document.getElementById("projectName").innerText = project.name;
document.getElementById("projectStatus").innerText = project.status;
document.getElementById("projectStatus").classList.add(project.status);
document.getElementById("projectDeadline").innerText =
  new Date(project.deadline).toDateString();

/* ======================
   ACTIONS
====================== */
function markCompleted() {
  project.status = "COMPLETED";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  alert("Project marked as completed");
  location.reload();
}

function archiveProject() {
  if (!confirm("Archive this project?")) return;
  projects = projects.filter(p => p.id !== projectId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.location.href = "dashboard.html";
}

function goBack() {
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
