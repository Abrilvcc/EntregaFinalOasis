// autentificador.js

// Función onLoad que se ejecuta al cargar la página para obtener los datos del usuario
const onLoad = async () => {
    try {
        const response = await axios.get("http://localhost:5000/user/me", { withCredentials: true });
        const user = `${response.data.nombre} ${response.data.apellido}`;
        const userName = document.getElementById("user-name");
        userName.textContent = user;
    } catch (error) {
        window.location.href = "./login.html"; // Redirige al login si no está autenticado
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // Verifica si está autenticado en el localStorage

    if (isAuthenticated) {
        try {
            // Verificación adicional con el backend
            const response = await axios.get("http://localhost:5000/user/validate", { withCredentials: true });
            if (!response.data.isAuthenticated) {
                localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
                window.location.href = "./login.html"; // Redirige al login si no está autenticado
                return;
            }
        } catch (error) {
            console.error("Error al verificar la autenticación:", error);
            localStorage.removeItem('isAuthenticated');
            window.location.href = "./login.html"; // Redirige al login si hay un error
            return;
        }

        // Si está autenticado, ejecuta onLoad para cargar los datos del usuario
        await onLoad();

        // Mostrar el botón de logout y ocultar el login y registro
        const logoutButton = document.querySelector("#logout-button");
        const loginLink = document.querySelector("#login-link");
        const registerLink = document.querySelector("#register-link");

        logoutButton.classList.remove("hidden"); // Muestra el botón de Logout
        loginLink.classList.add("hidden"); // Oculta el enlace de Login
        registerLink.classList.add("hidden"); // Oculta el enlace de Registro

        // Agregar el evento de clic para redirigir al formulario de login
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
            window.location.href = "login.html"; // Redirige al formulario de login
        });
    } else {
        // Si no está autenticado, muestra los enlaces de login y registro
        const logoutButton = document.querySelector("#logout-button");
        const loginLink = document.querySelector("#login-link");
        const registerLink = document.querySelector("#register-link");

        logoutButton.classList.add("hidden"); // Oculta el botón de Logout
        loginLink.classList.remove("hidden"); // Muestra el enlace de Login
        registerLink.classList.remove("hidden"); // Muestra el enlace de Registrar
    }
});
