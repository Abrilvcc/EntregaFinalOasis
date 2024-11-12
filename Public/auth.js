document.addEventListener('DOMContentLoaded', () => {
    // Obtener los botones
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const profileButton = document.getElementById('profile-button');
    const logoutButton = document.getElementById('logout-button');
  
    // Función para verificar si el usuario está logueado
    async function checkIfLoggedIn() {
        try {
            // Verifica si hay un token de sesión válido (puedes cambiar la verificación según tu implementación)
            const response = await fetch('https://proyectobandaoasis.onrender.com//user/validates', {
                method: 'GET',
                credentials: 'include', // Incluye las credenciales (cookies, etc)
            });
            
            const data = await response.json();
            if (response.status === 200 && data.isLoggedIn) {
                // Si el usuario está logueado
                loginButton.classList.add('hidden');
                registerButton.classList.add('hidden');
                profileButton.classList.remove('hidden');
                logoutButton.classList.remove('hidden');
            } else {
                // Si el usuario no está logueado
                loginButton.classList.remove('hidden');
                registerButton.classList.remove('hidden');
                profileButton.classList.add('hidden');
                logoutButton.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error al verificar el estado de la sesión:', error);
            // En caso de error, mostramos los botones de login y registro
            loginButton.classList.remove('hidden');
            registerButton.classList.remove('hidden');
            profileButton.classList.add('hidden');
            logoutButton.classList.add('hidden');
        }
    }

    // Función de logout
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            // Llamada al backend para cerrar sesión
            await fetch('https://proyectobandaoasis.onrender.com//user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            // Una vez logueado, recargamos la barra de navegación
            checkIfLoggedIn();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });

    // Llamamos a la función para verificar el estado de la sesión al cargar la página
    checkIfLoggedIn();
});
