document.getElementById('perfilForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de manera convencional

    // Obtener los valores de los campos
    const username = document.getElementById('username').value;
    const description = document.getElementById('description').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;
    const profilePicture = document.getElementById('imagen').value; // Si tienes un campo para la imagen

    // Obtener el token desde las cookies
    const token = getTokenFromCookies();

    if (!token) {
        alert('No se encontró el token. Asegúrate de estar autenticado.');
        return;
    }

    // Datos a enviar
    const data = {
        username: username,
        profilePicture: profilePicture, // Este es el valor de la imagen (asegúrate de tener el campo en tu formulario)
        description: description,
        age: age,
        dob: dob
    };

    try {
        // Enviar la solicitud al backend para actualizar el perfil
        const response = await fetch('http://localhost:5000/user/updateProfile', {
            method: 'PUT', // O 'POST' dependiendo de la lógica de tu backend
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
            },
            body: JSON.stringify(data) // Convertir los datos a formato JSON
        });

        const responseData = await response.json();

        if (responseData.success) {
            alert('Perfil actualizado exitosamente');
            window.location.href = "user/miperfil"; // Redirección al perfil
        } else {
            alert('Hubo un error al actualizar el perfil');
        }
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
    }
});

// Función para obtener el token desde las cookies
function getTokenFromCookies() {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [name, value] = cookies[i].split('=');
        if (name === 'token') {
            return value; // Devuelve el valor del token si lo encuentra
        }
    }
    return null; // Si no encuentra el token
}
