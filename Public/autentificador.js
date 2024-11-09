document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si hay un token en localStorage o cookies
    const token = localStorage.getItem('token') || getCookie('token'); // Obtener token de localStorage o cookies
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');

    if (token) {
        // Si el usuario está logueado, ocultar los enlaces de Login y Registrar, y mostrar Logout
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        // Si no está logueado, mostrar los enlaces de Login y Registrar, y ocultar Logout
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    // Lógica para el logout
    logoutButton.addEventListener('click', function() {
        // Eliminar el token de localStorage y cookies
        localStorage.removeItem('token');
        setCookie('token', '', -1); // Establecer la cookie con una fecha de expiración en el pasado
        // Redirigir a la página principal (o login)
        window.location.href = 'index.html';
    });
});

// Función para obtener el valor de una cookie
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Función para establecer una cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}
