// Verificar si el usuario está logueado
async function checkLoginStatus() {
    try {
        const response = await axios.get('https://proyectobandaoasis.onrender.com/user/validates', { withCredentials: true });

        // Si el usuario está logueado
        if (response.status === 200 && response.data.isLoggedIn) {
            // Ocultar los enlaces de login y registro
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('register-link').style.display = 'none';

            // Mostrar el botón de logout
            document.getElementById('logout-button').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al verificar el estado de la sesión:', error);
    }
}

// Función para cerrar sesión
document.getElementById('logout-button')?.addEventListener('click', async () => {
    try {
        await axios.post('https://proyectobandaoasis.onrender.com/user/logout', {}, { withCredentials: true });
        // Después de cerrar sesión, recargar la página para actualizar el estado
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

// Llamar a la función al cargar la página
checkLoginStatus();
