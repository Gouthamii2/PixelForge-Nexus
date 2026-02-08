const API = "http://localhost:5000/api/auth/login";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!email || !password) {
    error.innerText = "Enter email & password";
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      error.innerText = data.message || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";

  } catch {
    error.innerText = "Server not responding";
  }
}
