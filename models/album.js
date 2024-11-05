const mongoose = require('mongoose');

// Esquema para la canción
const cancionSchema = new mongoose.Schema({
    nombreDeCancion: {
        type: String,
         // Campo obligatorio
    },
    enlaceYouTube: {
        type: String,
        // Campo obligatorio
    }
});

// Esquema para el álbum
const albumSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true, // El título del álbum es obligatorio
    },
    descripcion: {
        type: String,
    },
    portada: {
        type: String
    },
    fechaDeLanzamiento: {
        type: Number,
    },
    
    canciones: [cancionSchema] // Usa el esquema de canción aquí
});

// Crear el modelo de álbum
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
