// Función para validar el formulario al enviarlo
document.getElementById("addSongForm").addEventListener("submit", function(event) {
    let titulo = document.getElementById("titulo").value;
    let duracion = document.getElementById("duracion").value;

    // Validación del título
    if (titulo.trim() === "") {
        alert("El título de la canción no puede estar vacío.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }

    // Validación de la duración
    if (duracion.trim() === "") {
        alert("La duración de la canción no puede estar vacía.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }

    // Validación del formato de duración (MM:SS)
    const duracionRegex = /^\d{2}:\d{2}$/;
    if (!duracionRegex.test(duracion)) {
        alert("La duración debe estar en formato MM:SS.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }
});
