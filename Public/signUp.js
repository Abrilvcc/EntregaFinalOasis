document.getElementById("signUpForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el envío por defecto del formulario

    // Recopilar los datos del formulario
    const data = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("correo").value,
        password: document.getElementById("password").value
    };

    try {
        // Hacer la solicitud POST
        await axios.post("https://proyectobandaoasis.onrender.com/user", data);

        // Mostrar alerta de éxito
        Swal.fire({
            title: 'Éxito!',
            text: 'Usuario registrado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            // Redirigir a la página de inicio después de cerrar la alerta
            window.location.href = 'index.html'; 
        });
    } catch (error) {
        // Manejar errores
        console.error(error);
        Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al registrar el usuario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});
