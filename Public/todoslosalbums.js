// Elementos del DOM
const albumListElement = document.getElementById("album-list");
const albumTitleElement = document.getElementById("album-title");
const albumDescriptionElement = document.getElementById("album-description");
const albumImageElement = document.getElementById("album-image");
let currentAlbumId; // Variable para almacenar el ID del álbum actual

// Cargar los álbumes desde el servidor
async function loadAlbums() {
    try {
        const response = await axios.get('https://proyectobandaoasis.onrender.com/albums');
        const albums = response.data;

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
    currentAlbumId = album._id;

    document.getElementById("add-song-btn").onclick = openAddSongModal;
    document.getElementById("add-song-btn").classList.remove("hidden");

    document.getElementById("show-songs-btn").onclick = () => loadAlbumSongs(album._id);
    document.getElementById("show-songs-btn").classList.remove("hidden");

    document.getElementById("edit-album-btn").onclick = () => openEditModal(album);
    document.getElementById("edit-album-btn").classList.remove("hidden");

    document.getElementById("delete-album-btn").onclick = () => confirmDeleteAlbum();
    document.getElementById("delete-album-btn").classList.remove("hidden");

    loadAlbumSongs(album._id);
}

// Abrir modal de edición con la información del álbum
function openEditModal(album) {
    document.getElementById("edit-album-title").value = album.titulo || '';
    document.getElementById("edit-album-description").value = album.descripcion || '';
    document.getElementById("edit-album-image").value = album.portada || '';
    openModal();
}

// Abrir modal
function openModal() {
    const modal = document.getElementById("albumModal");
    modal.showModal();
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("albumModal");
    modal.close();
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
        await axios.delete(`https://proyectobandaoasis.onrender.com/albums/${albumId}`);
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
    event.preventDefault();
    const updatedAlbum = {
        titulo: document.getElementById("edit-album-title").value,
        descripcion: document.getElementById("edit-album-description").value,
        portada: document.getElementById("edit-album-image").value
    };

    try {
        await axios.put(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}`, updatedAlbum);

        albumTitleElement.innerText = updatedAlbum.titulo || 'Título no disponible';
        albumDescriptionElement.innerText = updatedAlbum.descripcion || 'Descripción no disponible';
        albumImageElement.src = updatedAlbum.portada || 'ImagenDefault.jpg';

        Swal.fire({
            title: 'Éxito',
            text: 'Álbum actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        
        closeModal();
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
        appendAlbum(response.data);

        closeAddAlbumModal();
        document.getElementById("addAlbumForm").reset();

        setTimeout(() => {
            Swal.fire('Éxito', 'Álbum agregado correctamente', 'success');
        }, 100);

        loadAlbums();
    })
    .catch(() => {
        Swal.fire('Error', 'No se pudo agregar el álbum', 'error');
    });
});

// Función para agregar un álbum a la lista en el sidebar
function appendAlbum(album) {
    const listItem = document.createElement('li');
    listItem.classList.add('cursor-pointer', 'hover:text-purple-400');
    listItem.innerText = album.titulo || 'Sin título';
    listItem.onclick = () => displayAlbumDetails(album);
    albumListElement.appendChild(listItem);
}

// Función para renderizar álbumes
function renderAlbums(albums) {
    albumListElement.innerHTML = '';
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

// Función para cargar las canciones de un álbum específico y mostrarlas en el modal
async function loadAlbumSongs(albumId) {
    try {
        const response = await axios.get(`https://proyectobandaoasis.onrender.com/albums/${albumId}/canciones`);
        const songs = response.data;
        const songListElement = document.getElementById("song-list");

        songListElement.innerHTML = '';

        songs.forEach(song => {
            if (!document.getElementById(`song-${song._id}`)) {
                const listItem = document.createElement("li");
                listItem.id = `song-${song._id}`;
                listItem.innerText = song.nombreDeCancion;

                if (song.enlaceYouTube) {
                    const youtubeLink = document.createElement("a");
                    youtubeLink.href = song.enlaceYouTube;
                    youtubeLink.target = "_blank";
                    youtubeLink.innerText = " Ver en YouTube";
                    youtubeLink.classList.add("ml-2", "text-blue-500", "hover:underline");
                    listItem.appendChild(youtubeLink);
                }

                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Eliminar";
                deleteButton.classList.add("delete-song-btn", "ml-4");
                deleteButton.onclick = () => deleteSong(albumId, song._id);

                listItem.appendChild(deleteButton);
                songListElement.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error('Error al cargar canciones:', error);
        Swal.fire('Error', 'No se pudieron cargar las canciones', 'error');
    }
}

// Función para agregar una canción
async function addSong(event) {
    event.preventDefault();

    const nombreDeCancionInput = document.getElementById("nombreDeCancion");
    const enlaceYouTubeInput = document.getElementById("enlaceYouTube");

    const newSong = {
        nombreDeCancion: nombreDeCancionInput.value,
        enlaceYouTube: enlaceYouTubeInput.value
    };

    try {
        await axios.post(`https://proyectobandaoasis.onrender.com/albums/${currentAlbumId}/canciones`, newSong);
        
        Swal.fire({
            title: 'Éxito',
            text: 'Canción agregada correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        nombreDeCancionInput.value = '';
        enlaceYouTubeInput.value = '';

        loadAlbumSongs(currentAlbumId);
    } catch (error) {
        console.error('Error al agregar canción:', error);
        Swal.fire('Error', 'No se pudo agregar la canción', 'error');
    }

    closeAddSongModal();
}

// Función para eliminar una canción
async function deleteSong(albumId, songId) {
    try {
        await axios.delete(`https://proyectobandaoasis.onrender.com/albums/${albumId}/canciones/${songId}`);

        Swal.fire({
            title: 'Éxito',
            text: 'Canción eliminada correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        loadAlbumSongs(albumId);
    } catch (error) {
        console.error('Error al eliminar canción:', error);
        Swal.fire('Error', 'No se pudo eliminar la canción', 'error');
    }
}

// Inicializar la carga de álbumes al cargar la página
loadAlbums();
