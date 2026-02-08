const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* DECODE JWT (SIMPLE CLIENT VIEW) */
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

const user = parseJwt(token);

document.getElementById("role").innerText = user.role || "ADMIN";

/* NAV */
function goDashboard() {
  window.location.href = "dashboard.html";
}

function goProjects() {
  window.location.href = "dashboard.html";
}

function goReports() {
  window.location.href = "reports.html";
}

/* SECURITY PLACEHOLDER */
function showAlert() {
  alert(
    "Password change requires re-authentication.\n\n" +
    "This feature is intentionally restricted for security."
  );
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
