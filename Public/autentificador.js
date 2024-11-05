// autentificador.js

// Función onLoad que se ejecuta al cargar la página para obtener los datos del usuario
const onLoad = async () => {
    try {
        const response = await axios.get("http://localhost:5000/user/me", { withCredentials: true }); 
        const user = `${response.data.nombre} ${response.data.apellido}`; 
        const userName = document.getElementById("user-name");
        userName.textContent = user;
    } catch (error) {
        window.location.href = "./login.html"; 
    }
};


document.addEventListener("DOMContentLoaded", async function () {
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // Verifica si está autenticado

    // Si hay autenticación, verifica con el backend
    if (isAuthenticated) {
        try {
            const response = await axios.get("http://localhost:5000/user/validate", { withCredentials: true });
            if (!response.data.isAuthenticated) {
                // Si no está autenticado, redirige al login
                localStorage.removeItem('isAuthenticated'); // Limpia el estado de autenticación
                window.location.href = "./login.html";
                return;
            }
        } catch (error) {
            console.error("Error al verificar la autenticación:", error);
            localStorage.removeItem('isAuthenticated'); // Limpia el estado de autenticación
            window.location.href = "./login.html";
            return;
        }
    }

    // Si no hay autenticación, muestra el formulario de login y esconde el logout
    const logoutButton = document.querySelector("#logout-button");
    const loginLink = document.querySelector("#login-link");
    const registerLink = document.querySelector("#register-link");

    if (isAuthenticated) {
        logoutButton.classList.remove("hidden"); // Muestra el botón de Logout
        loginLink.classList.add("hidden"); // Oculta el enlace de Login
        registerLink.classList.add("hidden"); // Oculta el enlace de Registrar

        // Agrega el evento de clic para redirigir al formulario de login
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
            window.location.href = "login.html"; // Redirige al formulario de login
        });

        // Ejecutar la función onLoad para obtener los datos del usuario
        await onLoad(); // Asegúrate de esperar la función onLoad para obtener datos del usuario
    } else {
        logoutButton.classList.add("hidden"); // Oculta el botón de Logout
        loginLink.classList.remove("hidden"); // Muestra el enlace de Login
        registerLink.classList.remove("hidden"); // Muestra el enlace de Registrar
    }
});
