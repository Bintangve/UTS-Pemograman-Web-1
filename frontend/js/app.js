const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const isLogin = () => sessionStorage.getItem("loginUser") !== null;

function renderLayout() {
  let menu = '<a class="nav-link text-white" href="index.html">Beranda</a>';
  if (isLogin()) {
    menu += '<a class="nav-link text-white" href="menu.html">Menu Utama</a><a class="nav-link text-white" href="#" onclick="logout()">Logout</a>';
  } else {
    menu += '<a class="nav-link text-white" href="login.html">Login</a><a class="nav-link text-white" href="register.html">Registrasi</a>';
  }
  document.getElementById("navbar").innerHTML = `<nav class="navbar navbar-expand-md navbar-dark"><div class="container">
    <a class="navbar-brand fw-bold" href="index.html">Nabati</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#m"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="m"><div class="navbar-nav ms-auto">${menu}</div></div></div></nav>`;
  document.getElementById("footer").innerHTML = `<div class="container">${FOOTER}</div>`;
}

function cardInformasi(i) {
  return `<div class="col-md-4 mb-4"><div class="card h-100"><div class="card-body d-flex flex-column">
    <h5 class="card-title">${i.judul}</h5><p class="card-text text-muted">${i.ringkasan}</p>
    <a href="detail.html?id=${i.id}" class="btn btn-nb mt-auto">Baca Selengkapnya</a></div></div></div>`;
}

function renderDetail() {
  const id = parseInt(new URLSearchParams(location.search).get("id"));
  const item = informasi.find(x => x.id === id);
  const box = document.getElementById("detail");
  if (!item) { box.innerHTML = '<div class="alert alert-warning">Informasi tidak ditemukan.</div>'; return; }
  box.innerHTML = `<h2 class="mb-3">${item.judul}</h2>` + item.isi.map(p => `<p>${p}</p>`).join("") +
    '<a href="index.html" class="btn btn-outline-secondary">&larr; Kembali</a>';
}

function register(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const users = getUsers();
  if (nama === "" || username === "" || password === "") {
    showAlert("Semua field wajib diisi.", "danger");
  } else if (password.length < 6) {
    showAlert("Password minimal 6 karakter.", "danger");
  } else if (users.some(u => u.username === username)) {
    showAlert("Username sudah terdaftar.", "danger");
  } else {
    users.push({ nama, username, password });
    localStorage.setItem("users", JSON.stringify(users));
    showAlert("Registrasi berhasil! Mengalihkan ke halaman login...", "success");
    setTimeout(() => location.href = "login.html", 1200);
  }
}

// Validasi login menggunakan struktur percabangan IF
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const user = getUsers().find(u => u.username === username);
  if (username === "" || password === "") {
    showAlert("Username dan password wajib diisi.", "danger");
  } else if (!user) {
    showAlert("Username belum terdaftar.", "danger");
  } else if (user.password !== password) {
    showAlert("Password salah.", "danger");
  } else {
    sessionStorage.setItem("loginUser", JSON.stringify(user));
    location.href = "menu.html"; // login sesuai -> pindah ke Halaman Menu Utama
  }
}

function logout() { sessionStorage.removeItem("loginUser"); location.href = "login.html"; }
function showAlert(msg, type) { document.getElementById("alert").innerHTML = `<div class="alert alert-${type}">${msg}</div>`; }

function guardMenu() {
  if (!isLogin()) { location.href = "login.html"; return; }
  const u = JSON.parse(sessionStorage.getItem("loginUser"));
  document.getElementById("welcome").textContent = "Selamat datang, " + u.nama + "!";
  document.getElementById("list").innerHTML = informasi.map(cardInformasi).join("");
}
