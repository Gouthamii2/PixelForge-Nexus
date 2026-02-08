const API = "http://localhost:5000/api/projects/all";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

let projects = [];

document.addEventListener("DOMContentLoaded", loadReports);

async function loadReports() {
  try {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    projects = await res.json();
    renderStats(projects);
    renderTable(projects);

  } catch (err) {
    alert("Failed to load reports");
    console.error(err);
  }
}

/* SUMMARY */
function renderStats(data) {
  document.getElementById("total").innerText = data.length;
  document.getElementById("active").innerText =
    data.filter(p => p.status === "ACTIVE").length;
  document.getElementById("completed").innerText =
    data.filter(p => p.status === "COMPLETED").length;
}

/* TABLE */
function renderTable(data) {
  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";

  data.forEach(p => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.status}</td>
      <td>${new Date(p.deadline).toDateString()}</td>
    `;

    tbody.appendChild(row);
  });
}

/* CSV EXPORT */
function downloadCSV() {
  let csv = "Project Name,Status,Deadline\n";

  projects.forEach(p => {
    csv += `${p.name},${p.status},${new Date(p.deadline).toDateString()}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pixelForge_reports.csv";
  link.click();
}

/* NAV */
function goDashboard() {
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
function downloadPDF() {
  fetch(`${API}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(projects => {
      let content = `
PIXELFORGE NEXUS – PROJECT REPORT

Total Projects: ${projects.length}
Active: ${projects.filter(p => p.status === "ACTIVE").length}
Completed: ${projects.filter(p => p.status === "COMPLETED").length}

----------------------------------
`;

      projects.forEach((p, i) => {
        content += `
${i + 1}. ${p.name}
   Status: ${p.status}
   Deadline: ${new Date(p.deadline).toDateString()}
`;
      });

      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "PixelForge_Report.pdf";
      a.click();
    });
}
