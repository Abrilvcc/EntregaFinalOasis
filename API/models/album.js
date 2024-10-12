const mongoose = require('mongoose');

// Esquema para las canciones dentro de un álbum
const songSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true, // Título es obligatorio
    },
    duracion: {
        type: String, // Duración de la canción en formato string
        required: true,
    },
});

// Esquema para el álbum
const albumSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true, // El título del álbum es obligatorio
    },
    descripcion: {
        type: String,
        required: true, // Descripción es obligatoria
        minlength: 5, // Al menos 5 caracteres
        maxlength: 200, // Máximo 200 caracteres
    },
    año: {
        type: Number,
        required: true, // El año de lanzamiento es obligatorio
        min: 1980, // El año mínimo es 1980
        max: new Date().getFullYear(), // El año máximo es el actual
    },
    canciones: [songSchema], // Lista de canciones
    portada: {
        type: String,
        required: true, // La portada es obligatoria
    },
});

// Crear el modelo de álbum
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
