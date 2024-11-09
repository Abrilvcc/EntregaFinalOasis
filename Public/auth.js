// auth.js
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const logoutButton = document.getElementById('logout-button');

// Verificar si el usuario está logueado
async function checkIfLoggedIn() {
  try {
    const response = await axios.get('http://localhost:5000/user/validates', { withCredentials: true });

    if (response.status === 200 && response.data.isLoggedIn) {
      // Ocultar login y registro, mostrar logout
      loginLink.classList.add('hidden'); // Ocultar el botón de login
      registerLink.classList.add('hidden'); // Ocultar el botón de registro
      logoutButton.classList.remove('hidden'); // Mostrar el botón de logout
    } else {
      // Mostrar login y registro, ocultar logout
      loginLink.classList.remove('hidden'); // Mostrar el botón de login
      registerLink.classList.remove('hidden'); // Mostrar el botón de registro
      logoutButton.classList.add('hidden'); // Ocultar el botón de logout
    }
  } catch (error) {
    console.error("Error al verificar el estado de la sesión:", error);
    // Si ocurre un error, consideramos que el usuario no está logueado
    loginLink.classList.remove('hidden'); // Mostrar el botón de login
    registerLink.classList.remove('hidden'); // Mostrar el botón de registro
    logoutButton.classList.add('hidden'); // Ocultar el botón de logout
  }
}

// Llamar a la función cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', checkIfLoggedIn);

// Funcionalidad para cerrar sesión
logoutButton.addEventListener('click', async (event) => {
  event.preventDefault(); // Prevenir la redirección
  try {
    await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });
    // Después de cerrar sesión, actualizamos la interfaz
    loginLink.classList.remove('hidden');
    registerLink.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});
