document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el formulario de login por su ID
    const formularioLogin = document.querySelector("#login-form");

    if (!formularioLogin) {
        console.error("No se encontró el formulario");
        return;
    }

    // Escucha el evento de envío del formulario
    formularioLogin.addEventListener("submit", function (event) {
        // Evita que el formulario se envíe de inmediato
        event.preventDefault();

        // Obtiene los valores de los campos de usuario y contraseña
        const username = document.querySelector("input[name='usuario']").value;
        const password = document.querySelector("input[name='contraseña']").value;
        //usuario y contraseña con comillas simples

        // Verifica si hay campos vacíos
        if (username === "" || password === "") {
            Swal.fire({
                title: "¡Error!",
                text: "Por favor, completa todos los campos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return; // Termina la función aquí
        }

        // Verifica si la contraseña es demasiado corta
        if (password.length < 6) {
            Swal.fire({
                title: "¡Error!",
                text: "Tu contraseña es demasiado corta.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            return; // Termina la función aquí
        }

        // Si todo está correcto, puedes proceder con el envío del formulario
        console.log("Formulario enviado");
    });
});