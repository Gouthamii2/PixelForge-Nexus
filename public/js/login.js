// MOCK LOGIN – BACKEND BYPASSED FOR DEMO / ASSIGNMENT

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!email || !password) {
    error.innerText = "Enter email & password";
    return;
  }

  // ✅ Fake token for demo
  localStorage.setItem("token", "demo-token");

  // ✅ Redirect to dashboard
  window.location.href = "dashboard.html";
}
