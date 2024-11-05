// UI.js (Este archivo solo maneja la UI)

document.addEventListener("DOMContentLoaded", function () {
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // Solo consulta el estado de autenticación local

    const logoutButton = document.querySelector("#logout-button");
    const loginLink = document.querySelector("#login-link");
    const registerLink = document.querySelector("#register-link");

    if (isAuthenticated) {
        logoutButton.classList.remove("hidden"); // Muestra el botón de Logout
        loginLink.classList.add("hidden"); // Oculta el enlace de Login
        registerLink.classList.add("hidden"); // Oculta el enlace de Registrar

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
            window.location.href = "login.html"; // Redirige al login
        });
    } else {
        logoutButton.classList.add("hidden"); // Oculta el botón de Logout
        loginLink.classList.remove("hidden"); // Muestra el enlace de Login
        registerLink.classList.remove("hidden"); // Muestra el enlace de Registrar
    }
});
