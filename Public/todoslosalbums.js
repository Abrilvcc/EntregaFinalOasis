// Elementos del DOM
const albumListElement = document.getElementById("album-list");
const albumTitleElement = document.getElementById("album-title");
const albumDescriptionElement = document.getElementById("album-description");
const albumImageElement = document.getElementById("album-image");
let currentAlbumId; // Variable para almacenar el ID del álbum actual

// Cargar los álbumes desde el servidor
async function loadAlbums() {
    try {
        const response = await axios.get('https://proyectobandaoasis.onrender.com/albums'); // Asegúrate de que esta URL sea correcta
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
        await axios.delete(`https://proyectobandaoasis.onrender.com/albums/${albumId}`); // Asegúrate de que esta URL sea correcta
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
        await axios.put(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}`, updatedAlbum); // Asegúrate de que esta URL sea correcta
        
        // Actualiza los detalles del álbum en el DOM sin recargar
        albumTitleElement.innerText = updatedAlbum.titulo || 'Título no disponible';
        albumDescriptionElement.innerText = updatedAlbum.descripcion || 'Descripción no disponible';
        albumImageElement.src = updatedAlbum.portada || 'ImagenDefault.jpg'; // Cambia a la nueva portada

        // Actualizar el título del álbum en la lista de la sidebar
        const albumListItems = albumListElement.querySelectorAll('li');
        albumListItems.forEach(item => {
            if (item.innerText === currentAlbumId) { // Compara el ID del álbum con el texto en la lista
                item.innerText = updatedAlbum.titulo; // Actualiza el título
            }
        });

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

// Abre el modal de agregar álbum
function openAddAlbumModal() {
    const addAlbumModal = document.getElementById('addAlbumModal');
    if (addAlbumModal) addAlbumModal.showModal();
}

// Cierra el modal de agregar álbum
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

    axios.post("https://proyectobandaoasis.onrender.com/albums", albumData)
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
    if (addSongModal) addSongModal.close();
}

async function loadAlbumSongs(albumId) {
    try {
        const response = await axios.get(`https://proyectobandaoasis.onrender.com/albums/${albumId}/canciones`);
        const songs = response.data;
        const songListElement = document.getElementById("song-list");

        // Limpia la lista de canciones antes de agregar nuevas canciones
        songListElement.innerHTML = '';

        // Agrega cada canción como un elemento de lista
        songs.forEach(song => {
            const listItem = document.createElement("li");
            listItem.id = `song-${song._id}`; // Asigna un ID único basado en el ID de la canción
            listItem.innerText = song.nombreDeCancion;

            // Agregar enlace de YouTube si existe
            if (song.enlaceYouTube) {
                const youtubeLink = document.createElement("a");
                youtubeLink.href = song.enlaceYouTube;
                youtubeLink.target = "_blank";
                youtubeLink.innerText = " Ver en YouTube";
                youtubeLink.classList.add("ml-2", "text-blue-500", "hover:underline");
                listItem.appendChild(youtubeLink);
            }

            // Crear botón de eliminación con icono de tacho de basura
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Icono de Font Awesome
            deleteButton.classList.add("delete-song-btn", "ml-4", "text-red-500", "hover:text-red-700", "cursor-pointer");
            deleteButton.onclick = () => deleteSong(albumId, song._id);

            listItem.appendChild(deleteButton);
            songListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error al cargar canciones:', error);
        Swal.fire('Error', 'No se pudieron cargar las canciones', 'error');
    }
}



// Función para agregar una canción
async function addSong(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener los valores de los campos de entrada
    const nombreDeCancionInput = document.getElementById("nombreDeCancion");
    const enlaceYouTubeInput = document.getElementById("enlaceYouTube");

    // Verificar que los inputs no sean null
    if (!nombreDeCancionInput || !enlaceYouTubeInput) {
        console.error("Los elementos 'nombreDeCancion' o 'enlaceYouTube' no existen");
        return; // Salir si no se encuentra algún elemento
    }

    const songData = {
        nombreDeCancion: nombreDeCancionInput.value,
        enlaceYouTube: enlaceYouTubeInput.value,
    };

    console.log("Datos de la canción a agregar:", songData); // Registro de los datos de la canción

    try {
        await axios.post(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}/canciones`, songData);
        Swal.fire('Éxito', 'Canción agregada correctamente', 'success').then(() => {
            closeAddSongModal(); // Cierra el modal de agregar canción
            loadAlbumSongs(currentAlbumId); // Recarga las canciones del álbum
        });
    } catch (error) {
        console.error('Error al agregar canción:', error); // Registro del error
        Swal.fire('Error', 'No se pudo agregar la canción', 'error');
    }
}


async function addSong(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener los valores de los campos de entrada
    const nombreDeCancionInput = document.getElementById("nombreDeCancion");
    const enlaceYouTubeInput = document.getElementById("enlaceYouTube");

    // Verificar que los inputs no sean null
    if (!nombreDeCancionInput || !enlaceYouTubeInput) {
        console.error("Los elementos 'nombreDeCancion' o 'enlaceYouTube' no existen");
        return; // Salir si no se encuentra algún elemento
    }

    const songData = {
        nombreDeCancion: nombreDeCancionInput.value,
        enlaceYouTube: enlaceYouTubeInput.value,
    };

    console.log("Datos de la canción a agregar:", songData); // Registro de los datos de la canción

    try {
        await axios.post(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}/canciones`, songData);
        Swal.fire('Éxito', 'Canción agregada correctamente', 'success').then(() => {
            closeAddSongModal(); // Cierra el modal de agregar canción
            loadAlbumSongs(currentAlbumId); // Recarga las canciones del álbum
        });
    } catch (error) {
        console.error('Error al agregar canción:', error); // Registro del error
        Swal.fire('Error', 'No se pudo agregar la canción', 'error');
    }
}

// Evento para agregar una canción
document.getElementById('addSongForm').addEventListener('submit', addSong);

// Función para eliminar una canción específica
async function deleteSong(albumId, songId) {
    try {
        await axios.delete(`https://proyectobandaoasis.onrender.com/albums/${albumId}/canciones/${songId}`);
        Swal.fire({
            title: 'Éxito',
            text: 'Canción eliminada correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        loadAlbumSongs(albumId); // Recarga la lista de canciones
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la canción',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}
document.getElementById('portada').addEventListener('input', function(event) {
    const url = event.target.value;
    const preview = document.getElementById('portadaPreview');
    preview.src = url; // Establece la URL de la imagen
    preview.style.display = 'block'; // Muestra la vista previa
});


// Inicializa la carga de álbumes al cargar la página
window.onload = loadAlbums;

// Mostrar vista previa de la imagen del álbum
document.getElementById("album-image").addEventListener("input", function() {
    const imageUrl = this.value;
    const imagePreviewElement = document.getElementById("image-preview"); // Asegúrate de tener un elemento con este ID en tu HTML
    imagePreviewElement.src = imageUrl; // Actualiza la fuente de la imagen de vista previa
});

// Mostrar la vista previa de la imagen en el modal de edición
document.getElementById("edit-album-image").addEventListener("input", function() {
    const imageUrl = this.value;
    const imagePreviewElement = document.getElementById("edit-image-preview"); // Asegúrate de tener un elemento con este ID en tu HTML
    imagePreviewElement.src = imageUrl; // Actualiza la fuente de la imagen de vista previa
});

function toggleFavorite(starIcon) {
    // Cambiar la clase del ícono según si es favorito o no
    if (starIcon.classList.contains('far')) {
        starIcon.classList.remove('far');
        starIcon.classList.add('fas'); // Cambiar a icono lleno
    } else {
        starIcon.classList.remove('fas');
        starIcon.classList.add('far'); // Volver a icono vacío
    }
}

