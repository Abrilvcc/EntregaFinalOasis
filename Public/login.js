// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el formulario de login por su ID
    const formularioLogin = document.querySelector("#login-form");

    // Verifica si el formulario existe
    if (!formularioLogin) {
        console.error("No se encontró el formulario");
        return;
    }

    // Escucha el evento de envío del formulario
    formularioLogin.addEventListener("submit", async function (event) {
        // Evita que el formulario se envíe de inmediato
        event.preventDefault();

        // Obtiene los valores de los campos de usuario y contraseña
        const username = document.querySelector("input[name='usuario']").value;
        const password = document.querySelector("input[name='contraseña']").value;

        // Verifica si hay campos vacíos
        if (username === "" || password === "") {
            Swal.fire({
                title: "¡Error!",
                text: "Por favor, completa todos los campos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        // Verifica si la contraseña es demasiado corta
        if (password.length < 6) {
            Swal.fire({
                title: "¡Error!",
                text: "Tu contraseña es demasiado corta.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        // Objeto para enviar al backend
        const loginData = {
            email: username,
            password: password,
        };

        try {
            // Solicitud de autenticación al backend
            const response = await axios.post("http://localhost:5000/user/login", loginData);
            console.log(response.data); // Verifica qué devuelve el servidor

            // Almacena el estado de autenticación en localStorage
            localStorage.setItem('isAuthenticated', 'true'); // Indica que el usuario está autenticado

            // Alerta de éxito y redirección
            Swal.fire({
                title: "¡Éxito!",
                text: "Inicio de sesión exitoso",
                icon: "success",
                confirmButtonText: "Aceptar",
            }).then(() => {
                // Redirige al usuario a la página de inicio
                window.location.href = "./index.html";
            });
        } catch (error) {
            console.error("Error en el inicio de sesión:", error); // Muestra el error en la consola
            // Mostrar el mensaje de error en caso de fallo en la autenticación
            Swal.fire({
                title: "¡Error!",
                text: "Email o contraseña incorrectos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    });

    // Gestión del cierre de sesión
    const logoutButton = document.querySelector("#logout-button"); // Asegúrate de que este ID coincida con el botón de logout

    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            try {
                // Realiza la solicitud al backend para cerrar sesión
                await axios.post("http://localhost:5000/user/logout");

                // Limpia el estado de autenticación en localStorage
                localStorage.removeItem('isAuthenticated');

                // Redirige al usuario al login
                window.location.href = "./login.html"; // Asegúrate de que la ruta sea correcta
            } catch (error) {
                console.error("Error al cerrar sesión:", error); // Muestra el error en la consola
                Swal.fire({
                    title: "¡Error!",
                    text: "No se pudo cerrar sesión.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        });
    }
});
