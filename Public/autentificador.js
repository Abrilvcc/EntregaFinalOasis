document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Verificación de autenticación con el backend usando el token en las cookies
        console.log("Verificando autenticación...");
        const response = await axios.get("http://localhost:5000/user/validate", { withCredentials: true });
        
        console.log("Respuesta del servidor:", response.data);

        if (response.data.isAuthenticated) {
            // Si está autenticado, ejecuta onLoad para cargar los datos del álbum
            await onLoad();

            // Mostrar los botones de logout y ocultar el login y registro
            const logoutButton = document.querySelector("#logout-button");
            const loginLink = document.querySelector("#login-link");
            const registerLink = document.querySelector("#register-link");

            if (logoutButton && loginLink && registerLink) {
                logoutButton.classList.remove("hidden"); // Muestra el botón de Logout
                loginLink.classList.add("hidden"); // Oculta el enlace de Login
                registerLink.classList.add("hidden"); // Oculta el enlace de Registro
            }

            // Agregar el evento de clic para cerrar sesión
            logoutButton?.addEventListener("click", async function () {
                try {
                    await axios.post("http://localhost:5000/user/logout", {}, { withCredentials: true });
                    window.location.href = "login.html"; // Redirige al login
                } catch (err) {
                    console.error("Error al cerrar sesión:", err);
                }
            });

            // Mostrar los botones de agregar y editar álbumes solo si está autenticado
            const addAlbumButton = document.getElementById("add-album-btn");
            const editAlbumButton = document.getElementById("edit-album-btn");

            if (addAlbumButton && editAlbumButton) {
                addAlbumButton.classList.remove("hidden"); // Muestra el botón de agregar álbum
                editAlbumButton.classList.remove("hidden"); // Muestra el botón de editar álbum
            }

        } else {
            console.log("No autenticado, redirigiendo...");
            // Si no está autenticado, redirige al login
            window.location.href = "./login.html";
        }
    } catch (error) {
        // Si hay un error en la verificación, redirige al login
        console.error("Error al verificar la autenticación:", error);
        window.location.href = "./login.html"; // Redirige al login
    }
});
