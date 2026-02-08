const API = "http://localhost:5000/api/projects";
const token = localStorage.getItem("token");

/* =========================
   AUTH CHECK
========================= */
if (!token) {
  window.location.href = "index.html";
}

/* =========================
   GLOBAL CHART REFS
========================= */
let totalChart, statusChart, deadlineChart;
let reportStatusChart, reportBarChart, reportDeadlineChart;

/* =========================
   SIDEBAR NAVIGATION
========================= */
function showSection(section, el) {
  const sections = ["dashboard", "projects", "reports", "settings"];

  sections.forEach(s => {
    const sec = document.getElementById(s + "Section");
    if (sec) sec.style.display = s === section ? "block" : "none";
  });

  document.querySelectorAll(".sidebar li").forEach(li =>
    li.classList.remove("active")
  );

  if (el) el.classList.add("active");

  if (section === "reports") {
    loadProjects();
  }
}

/* =========================
   ON LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
  showLoading();
  loadProjects();
});

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   UI HELPERS
========================= */
function showLoading() {
  const el = document.getElementById("projectsContainer");
  if (el) el.innerHTML = "<p>Loading projects...</p>";
}

function showEmpty() {
  const el = document.getElementById("projectsContainer");
  if (el) el.innerHTML = "<p>No projects found 🚀</p>";
}

/* =========================
   LOAD PROJECTS
========================= */
async function loadProjects() {
  try {
    const res = await fetch(`${API}/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const projects = await res.json();

    renderStats(projects);
    renderProjects(projects);
    renderCharts(projects);
    renderReports(projects);

  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard");
  }
}

/* =========================
   STATS
========================= */
function renderStats(projects) {
  document.getElementById("totalCount").innerText = projects.length;
  document.getElementById("activeCount").innerText =
    projects.filter(p => p.status === "ACTIVE").length;
  document.getElementById("completedCount").innerText =
    projects.filter(p => p.status === "COMPLETED").length;
}

/* =========================
   PROJECT LIST
========================= */
function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!projects.length) {
    showEmpty();
    return;
  }

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <span class="badge ${p.status}">${p.status}</span>
      <p><b>Deadline:</b> ${new Date(p.deadline).toDateString()}</p>
      <div class="card-actions">
        <button onclick="openProject(${p.id})">View</button>
        <button onclick="archiveProject(${p.id})">Archive</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/* =========================
   PROJECT DETAILS
========================= */
function openProject(id) {
  window.location.href = `project.html?id=${id}`;
}

/* =========================
   CREATE PROJECT
========================= */
async function createProject() {
  const name = document.getElementById("name").value;
  const deadline = document.getElementById("deadline").value;
  const status = document.getElementById("status").value;

  if (!name || !deadline) {
    alert("Fill all fields");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, deadline, status })
  });

  closeModal();
  loadProjects();
}

/* =========================
   ARCHIVE PROJECT
========================= */
async function archiveProject(id) {
  if (!confirm("Archive this project?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadProjects();
}

/* =========================
   MODAL
========================= */
function openModal() {
  document.getElementById("modal").style.display = "flex";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* =========================
   DASHBOARD CHARTS
========================= */
function renderCharts(projects) {
  const active = projects.filter(p => p.status === "ACTIVE").length;
  const completed = projects.filter(p => p.status === "COMPLETED").length;

  totalChart?.destroy();
  statusChart?.destroy();
  deadlineChart?.destroy();

  totalChart = new Chart(document.getElementById("totalProjectsChart"), {
    type: "bar",
    data: {
      labels: ["Projects"],
      datasets: [{ data: [projects.length], backgroundColor: "#00c6ff" }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  statusChart = new Chart(document.getElementById("statusChart"), {
    type: "pie",
    data: {
      labels: ["Active", "Completed"],
      datasets: [{
        data: [active, completed],
        backgroundColor: ["#00c853", "#ff5252"]
      }]
    }
  });

  deadlineChart = new Chart(document.getElementById("deadlineChart"), {
    type: "line",
    data: {
      labels: projects.map(p => p.name),
      datasets: [{
        data: projects.map((_, i) => i + 1),
        borderColor: "#00c6ff",
        tension: 0.4
      }]
    }
  });
}

/* =========================
   REPORTS CHARTS
========================= */
function renderReports(projects) {
  const statusCanvas = document.getElementById("reportStatusChart");
  if (!statusCanvas) return;

  const active = projects.filter(p => p.status === "ACTIVE").length;
  const completed = projects.filter(p => p.status === "COMPLETED").length;

  reportStatusChart?.destroy();
  reportBarChart?.destroy();
  reportDeadlineChart?.destroy();

  reportStatusChart = new Chart(statusCanvas, {
    type: "doughnut",
    data: {
      labels: ["Active", "Completed"],
      datasets: [{
        data: [active, completed],
        backgroundColor: ["#00c853", "#ff5252"]
      }]
    }
  });

  reportBarChart = new Chart(document.getElementById("reportBarChart"), {
    type: "bar",
    data: {
      labels: ["Active", "Completed"],
      datasets: [{
        data: [active, completed],
        backgroundColor: ["#00c853", "#ff5252"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  reportDeadlineChart = new Chart(
    document.getElementById("reportDeadlineChart"),
    {
      type: "line",
      data: {
        labels: projects.map(p => p.name),
        datasets: [{
          data: projects.map((_, i) => i + 1),
          borderColor: "#00c6ff",
          tension: 0.4
        }]
      }
    }
  );
}

/* =========================
   REPORT DOWNLOADS (FIXED)
========================= */
function downloadCSV() {
  fetch(`${API}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(projects => {
      let csv = "Project Name,Status,Deadline\n";
      projects.forEach(p => {
        csv += `"${p.name}","${p.status}","${new Date(p.deadline).toDateString()}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PixelForge_Report.csv";
      a.click();
    });
}
