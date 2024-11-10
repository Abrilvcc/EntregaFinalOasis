// Función para obtener el token desde las cookies
function getTokenFromCookies() {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
    return token ? decodeURIComponent(token) : null;
}

// Elementos del DOM
const albumListElement = document.getElementById("album-list");
const albumTitleElement = document.getElementById("album-title");
const albumDescriptionElement = document.getElementById("album-description");
const albumImageElement = document.getElementById("album-image");
let currentAlbumId; // Variable para almacenar el ID del álbum actual

// Configurar Axios para incluir el token en las solicitudes automáticamente
axios.interceptors.request.use((config) => {
    const token = getTokenFromCookies();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Cargar los álbumes desde el servidor
async function loadAlbums() {
    try {
        const response = await axios.get('https://proyectobandaoasis.onrender.com/albums'); // Cambiado a localhost
        const albums = response.data; // Suponiendo que recibes un array de álbumes

        albumListElement.innerHTML = ''; // Limpia la lista antes de agregar nuevos álbumes

        albums.forEach(album => {
            appendAlbum(album); // Utiliza appendAlbum para agregar cada álbum a la lista
        });
    } catch (error) {
        console.error('Error al cargar álbumes:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los álbumes',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

// Mostrar detalles del álbum
function displayAlbumDetails(album) {
    albumTitleElement.innerText = album.titulo || 'Título no disponible';
    albumDescriptionElement.innerText = album.descripcion || 'Descripción no disponible';
    albumImageElement.src = album.portada || 'ImagenDefault.jpg'; // Ruta a una imagen predeterminada
    currentAlbumId = album._id; // Guarda el ID del álbum actual

    document.getElementById("add-song-btn").onclick = openAddSongModal;
    document.getElementById("add-song-btn").classList.remove("hidden");

    document.getElementById("show-songs-btn").onclick = () => loadAlbumSongs(album._id); // Pasa el ID del álbum a la función
    document.getElementById("show-songs-btn").classList.remove("hidden");

    document.getElementById("edit-album-btn").onclick = () => openEditModal(album); // Función para editar álbum
    document.getElementById("edit-album-btn").classList.remove("hidden");

    document.getElementById("delete-album-btn").onclick = () => confirmDeleteAlbum(); // Función para eliminar álbum
    document.getElementById("delete-album-btn").classList.remove("hidden");

    loadAlbumSongs(album._id); // Carga las canciones del álbum
}

// Abrir modal de edición con la información del álbum
function openEditModal(album) {
    // Rellenar los inputs del modal con la información del álbum
    document.getElementById("edit-album-title").value = album.titulo || '';
    document.getElementById("edit-album-description").value = album.descripcion || '';
    document.getElementById("edit-album-image").value = album.portada || '';

    openModal(); // Abrir el modal
}

// Abrir modal
function openModal() {
    const modal = document.getElementById("albumModal");
    modal.showModal(); // Usar showModal para mostrar el dialog
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("albumModal");
    modal.close(); // Usar close para ocultar el dialog
}

// Confirmar eliminación del álbum
async function confirmDeleteAlbum() {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este álbum después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        await deleteAlbum(currentAlbumId);
    }
}

// Eliminar álbum
async function deleteAlbum(albumId) {
    try {
        await axios.delete(`https://proyectobandaoasis.onrender.com/albums/${albumId}`); // Cambiado a localhost
        Swal.fire({
            title: 'Éxito',
            text: 'Álbum eliminado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        loadAlbums(); // Recargar álbumes después de eliminar
    } catch (error) {
        console.error('Error al eliminar el álbum:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el álbum',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

// Función para actualizar el álbum
async function updateAlbum(event) {
    event.preventDefault(); // Evitar el envío del formulario
    const updatedAlbum = {
        titulo: document.getElementById("edit-album-title").value,
        descripcion: document.getElementById("edit-album-description").value,
        portada: document.getElementById("edit-album-image").value
    };

    try {
        // Actualizar el álbum en el servidor
        await axios.put(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}`, updatedAlbum); // Cambiado a localhost
        
        // Actualiza los detalles del álbum en el DOM sin recargar
        albumTitleElement.innerText = updatedAlbum.titulo || 'Título no disponible';
        albumDescriptionElement.innerText = updatedAlbum.descripcion || 'Descripción no disponible';
        albumImageElement.src = updatedAlbum.portada || 'ImagenDefault.jpg'; // Cambia a la nueva portada

        Swal.fire({
            title: 'Éxito',
            text: 'Álbum actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        
        closeModal(); // Cerrar el modal
    } catch (error) {
        console.error('Error al actualizar el álbum:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el álbum',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

// Abre el modal de añadir álbum
function openAddAlbumModal() {
    const addAlbumModal = document.getElementById('addAlbumModal');
    if (addAlbumModal) addAlbumModal.showModal();
}

// Cierra el modal de añadir álbum
function closeAddAlbumModal() {
    const addAlbumModal = document.getElementById('addAlbumModal');
    if (addAlbumModal) addAlbumModal.close();
}

// Función para obtener los valores del formulario
function getInputValues() {
    return {
        titulo: document.querySelector("input[name='titulo']").value,
        yearOfRelease: document.querySelector("input[name='yearOfRelease']").value,
        descripcion: document.querySelector("textarea[name='descripcion']").value,
        portada: document.querySelector("input[name='portada']").value
    };
}

// Función para agregar un álbum
document.getElementById('addAlbumForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const albumData = getInputValues();

    axios.post("https://proyectobandaoasis.onrender.com/albums", albumData) // Cambiado a localhost
    .then((response) => {
        // Agregar el álbum a la lista de manera instantánea
        appendAlbum(response.data); // Agrega el álbum a la lista en el index

        closeAddAlbumModal(); // Cierra el modal
        document.getElementById("addAlbumForm").reset(); // Limpia el formulario

        // Mostrar la alerta después de un pequeño retraso
        setTimeout(() => {
            Swal.fire('Éxito', 'Álbum agregado correctamente', 'success');
        }, 100); // Ajusta el tiempo de retraso según sea necesario

        loadAlbums(); // Recarga la lista de álbumes
    })
    .catch(() => {
        Swal.fire('Error', 'No se pudo agregar el álbum', 'error');
    });
});

// Función para agregar un álbum a la lista en el sidebar
function appendAlbum(album) {
    const listItem = document.createElement('li');
    listItem.classList.add('cursor-pointer', 'hover:text-purple-400');
    listItem.innerText = album.titulo || 'Sin título'; // Muestra el título del álbum
    listItem.onclick = () => displayAlbumDetails(album);
    albumListElement.appendChild(listItem);
}

// Función para renderizar álbumes
function renderAlbums(albums) {
    albumListElement.innerHTML = ''; // Limpiar la lista antes de agregar nuevos álbumes
    albums.forEach(album => {
        appendAlbum(album);
    });
}

// Abre el modal de añadir canción
function openAddSongModal() {
    const addSongModal = document.getElementById('addSongModal');
    if (addSongModal) addSongModal.showModal();
}

// Cierra el modal de añadir canción
function closeAddSongModal() {
    const addSongModal = document.getElementById('addSongModal');
    addSongModal.close();
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
    loadAlbums(); // Carga los álbumes al cargar la página
});

