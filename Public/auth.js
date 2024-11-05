document.addEventListener("DOMContentLoaded", function () {
    // Comprueba si el usuario está autenticado al cargar la página
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const logoutButton = document.querySelector("#logout-button");
    const loginLink = document.querySelector("#login-link");
    const registerLink = document.querySelector("#register-link");

    if (isAuthenticated) {
        logoutButton.classList.remove("hidden"); // Muestra el botón de Logout
        loginLink.classList.add("hidden"); // Oculta el enlace de Login
        registerLink.classList.add("hidden"); // Oculta el enlace de Registrar

        // Agrega el evento de clic para redirigir al formulario de login
        logoutButton.addEventListener("click", function () {
            // Opcionalmente, puedes eliminar el estado de autenticación
            localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
            window.location.href = "Login.html"; // Redirige al formulario de login
        });
    } else {
        logoutButton.classList.add("hidden"); // Oculta el botón de Logout
        loginLink.classList.remove("hidden"); // Muestra el enlace de Login
        registerLink.classList.remove("hidden"); // Muestra el enlace de Registrar
    }
});
