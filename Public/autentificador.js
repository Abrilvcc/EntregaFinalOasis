document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si hay un token en localStorage o cookies
    const token = localStorage.getItem('token') || getCookie('token'); // Obtener token de cookies
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    const addAlbumButton = document.getElementById('add-album-button');  // Botón para agregar álbum
    const albumActions = document.querySelectorAll('.album-actions'); // Elementos con acciones de álbum (ej. eliminar)

    if (token) {
        // Si el usuario está logueado, ocultar los enlaces de Login y Registrar, y mostrar Logout
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutButton.style.display = 'block';
        
        // Mostrar el botón de agregar álbum solo si el usuario está logueado
        addAlbumButton.style.display = 'block';

        // Mostrar las acciones de álbum (como eliminar) solo si el usuario tiene permisos
        albumActions.forEach(action => action.style.display = 'block');

    } else {
        // Si no está logueado, mostrar los enlaces de Login y Registrar, y ocultar Logout
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutButton.style.display = 'none';

        // Ocultar el botón de agregar álbum y las acciones de álbum
        addAlbumButton.style.display = 'none';
        albumActions.forEach(action => action.style.display = 'none');
    }

    // Lógica para el logout
    logoutButton.addEventListener('click', function() {
        // Eliminar el token de localStorage y cookies
        localStorage.removeItem('token');
        setCookie('token', '', -1); // Establecer la cookie con una fecha de expiración en el pasado
        // Redirigir a la página principal (o login)
        window.location.href = 'index.html';
    });

    // Lógica para agregar álbum si el usuario está logueado
    addAlbumButton.addEventListener('click', function() {
        if (!token) {
            alert('Por favor, inicie sesión para agregar un álbum.');
            return;
        }
        window.location.href = 'addalbum.html'; // Redirige a la página para agregar álbum
    });

    // Lógica para eliminar un álbum (asumiendo que cada álbum tiene un botón con una clase específica)
    albumActions.forEach(action => {
        action.addEventListener('click', function() {
            if (!token) {
                alert('Por favor, inicie sesión para eliminar un álbum.');
                return;
            }

            // Lógica para eliminar álbum aquí, por ejemplo:
            const albumId = action.dataset.albumId; // Asumiendo que cada acción tiene un data-album-id
            // Llamar a la función de eliminación de álbum usando el albumId
            deleteAlbum(albumId); 
        });
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

// Función para eliminar un álbum
function deleteAlbum(albumId) {
    // Aquí puedes agregar la lógica para eliminar un álbum, por ejemplo:
    fetch(`https://proyectobandaoasis.onrender.com/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Álbum eliminado correctamente') {
            alert('Álbum eliminado');
            window.location.reload(); // Recargar la página para actualizar la lista de álbumes
        } else {
            alert('Error al eliminar el álbum');
        }
    })
    .catch(error => alert('Hubo un problema con la eliminación del álbum.'));
}
