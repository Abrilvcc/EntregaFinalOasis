let lastDeletedAlbum = null; // Variable para almacenar el último álbum eliminado
const protectedAlbums = [
    "6716dbe7cfb4abc866631a62", // Álbum 1 protegido
    "6716dc38cfb4abc866631a67"  // Álbum 2 protegido
]; // Lista de álbumes que no se deben eliminar

// Función para alternar el estado de favorito
function toggleFavorite(icon) {
    if (icon.classList.contains('active')) {
        icon.classList.remove('active');
        icon.innerHTML = '&#9734;'; // Estrella vacía
    } else {
        icon.classList.add('active');
        icon.innerHTML = '&#9733;'; // Estrella llena
    }
}

// Función para cargar todos los álbumes
function fetchAlbums() {
    axios.get("http://localhost:5000/album")
        .then((response) => {
            const albums = response.data;
            const albumsContainer = document.getElementById("albumsContainer");
            albumsContainer.innerHTML = ''; // Limpia el contenedor

            const filteredAlbums = albums.filter(album => !protectedAlbums.includes(album._id));
            filteredAlbums.forEach(album => {
                appendAlbum(album);
            });
        })
        .catch(() => {
            Swal.fire('Error', 'No se pudo cargar los álbumes', 'error');
        });
}

// Función para agregar un álbum al contenedor
function appendAlbum(album) {
    const albumsContainer = document.getElementById("albumsContainer");

    const albumDiv = document.createElement("div");
    albumDiv.classList.add("album");

    const favoriteIcon = document.createElement("span");
    favoriteIcon.classList.add("favorite-icon", "text-gray-500", "absolute", "top-2", "cursor-pointer", "text-4xl");
    favoriteIcon.innerHTML = "&#9734;";
    favoriteIcon.onclick = () => toggleFavorite(favoriteIcon);
    albumDiv.appendChild(favoriteIcon);

    const albumImage = document.createElement("img");
    albumImage.src = album.portada || "ImagenDefault.jpg";
    albumImage.alt = album.titulo || "Imagen no disponible";
    albumDiv.appendChild(albumImage);

    const albumTitle = document.createElement("h4");
    albumTitle.textContent = album.titulo || "Título no disponible";
    albumDiv.appendChild(albumTitle);

    const albumYear = document.createElement("p");
    albumYear.classList.add("text-white");
    albumYear.textContent = `Año: ${album.yearOfRelease || "Desconocido"}`;
    albumDiv.appendChild(albumYear);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Editar";
    editButton.onclick = () => window.location.href = `EditAlbum.html?id=${album._id}`;
    actionsDiv.appendChild(editButton);

    const selectButton = document.createElement("button");
    selectButton.classList.add("select-button");
    selectButton.textContent = "Seleccionar";
    selectButton.onclick = () => openAlbumInfoModal(album);
    actionsDiv.appendChild(selectButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "&#128465;";
    deleteButton.onclick = () => deleteAlbum(album._id);
    actionsDiv.appendChild(deleteButton);

    albumDiv.appendChild(actionsDiv);
    albumsContainer.appendChild(albumDiv);
}

// Función para eliminar un álbum
function deleteAlbum(albumId) {
    if (protectedAlbums.includes(albumId)) {
        Swal.fire('Error', 'No se puede eliminar este álbum', 'error');
        return;
    }

    axios.get(`http://localhost:5000/album/${albumId}`)
        .then(response => {
            lastDeletedAlbum = response.data;

            axios.delete(`http://localhost:5000/album/${albumId}`)
                .then(() => {
                    Swal.fire({
                        title: 'Álbum eliminado',
                        text: '¿Quieres deshacer esta acción?',
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonText: 'Deshacer',
                        cancelButtonText: 'Cerrar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            restoreAlbum(lastDeletedAlbum);
                        } else {
                            lastDeletedAlbum = null;
                        }
                    });
                    fetchAlbums();
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo eliminar el álbum', 'error');
                });
        })
        .catch(() => {
            Swal.fire('Error', 'No se pudo encontrar el álbum', 'error');
        });
}

// Función para restaurar el álbum eliminado
function restoreAlbum(album) {
    axios.post("http://localhost:5000/album", album)
        .then(() => {
            Swal.fire('Éxito', 'Álbum restaurado correctamente', 'success');
            fetchAlbums();
            lastDeletedAlbum = null;
        })
        .catch(() => {
            Swal.fire('Error', 'No se pudo restaurar el álbum', 'error');
        });
}


 




