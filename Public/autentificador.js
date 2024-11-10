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

document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('token'); // Obtener el token de la cookie
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    const addAlbumButton = document.getElementById('add-album-button');
    const albumActions = document.querySelectorAll('.album-actions');

    if (token) {
        // Si el token está presente, consideramos que el usuario está logueado
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (addAlbumButton) addAlbumButton.style.display = 'block';
        albumActions.forEach(action => action.style.display = 'block');
    } else {
        // Si no hay token, consideramos que el usuario no está logueado
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (addAlbumButton) addAlbumButton.style.display = 'none';
        albumActions.forEach(action => action.style.display = 'none');
    }

    // Lógica para logout
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; // Eliminar la cookie
            window.location.href = 'index.html'; // Redirigir a la página de inicio
        });
    }

    // Lógica para agregar álbum
    if (addAlbumButton) {
        addAlbumButton.addEventListener('click', function() {
            if (!token) {
                alert('Por favor, inicie sesión para agregar un álbum.');
                return;
            }
            window.location.href = 'addalbum.html'; // Redirige a la página para agregar álbum
        });
    }
});
