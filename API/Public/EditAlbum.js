// Función para validar el formulario al enviarlo
document.getElementById("editAlbumForm").addEventListener("submit", function(event) {
    let titulo = document.getElementById("titulo").value;
    let descripcion = document.getElementById("descripcion").value;
    let imagen = document.getElementById("imagen").value;

    // Validación del título
    if (titulo.trim() === "" || titulo.length < 3 || titulo.length > 100) {
        alert("El título debe tener entre 3 y 100 caracteres y no puede estar vacío.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }

    // Validación de la descripción
    if (descripcion.trim() === "") {
        alert("La descripción no puede estar vacía.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }

    // Validación de la URL de la imagen
    try {
        new URL(imagen); // Verificar si la URL es válida
    } catch (_) {
        alert("Por favor, ingresa una URL válida para la imagen.");
        event.preventDefault(); // Evitar el envío del formulario
        return;
    }
});
