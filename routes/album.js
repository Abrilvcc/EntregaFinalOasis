const express = require('express');
const Album = require('../models/album.js');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Función auxiliar para verificar la propiedad del álbum
async function checkAlbumOwnership(albumId, userId) {
    const album = await Album.findById(albumId);
    if (!album) {
        throw new Error("Álbum no encontrado");
    }
    if (album.user.toString() !== userId) {
        throw new Error("No tienes permiso para modificar este álbum");
    }
    return album;
}

// CRUD

// CREATE - Agregar un álbum (solo usuarios logueados)
router.post('/', verifyToken, async (req, res) => {
    try {
        // Asociamos el álbum al usuario logueado
        req.body.user = req.user.id;
        await Album.create(req.body);
        res.status(201).json({ message: "Álbum agregado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear el álbum" });
    }
});

// GET ALL - Traer todos los álbumes (sin necesidad de verificación de token)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const albums = await Album.find({})
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json(albums);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "No se encontraron álbumes" });
    }
});

// GET POR ID - Obtener un álbum por ID
router.get('/:id', async (req, res) => {
    try {
        const result = await Album.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Álbum no encontrado" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al buscar el álbum" });
    }
});

// UPDATE - Actualizar un álbum por ID (solo usuarios logueados)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const album = await checkAlbumOwnership(req.params.id, req.user.id);
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAlbum);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Eliminar un álbum por ID (solo usuarios logueados)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await checkAlbumOwnership(req.params.id, req.user.id);
        await Album.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Álbum eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE - Agregar una canción a un álbum (solo usuarios logueados)
router.post('/:id/canciones', verifyToken, async (req, res) => {
    const { nombreDeCancion, enlaceYouTube } = req.body;

    // Validamos que los campos obligatorios estén presentes
    if (!nombreDeCancion || !enlaceYouTube) {
        return res.status(400).json({ error: "Los campos 'nombreDeCancion' y 'enlaceYouTube' son obligatorios." });
    }

    // Validamos el formato del enlace de YouTube
    const youtubeRegex = /^(https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11})$/;
    if (!youtubeRegex.test(enlaceYouTube)) {
        return res.status(400).json({ error: "El enlace de YouTube no es válido." });
    }

    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado." });
        }

        // Verificamos que el usuario logueado sea el propietario del álbum
        if (album.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "No tienes permiso para agregar canciones a este álbum" });
        }

        album.canciones.push({ nombreDeCancion, enlaceYouTube });
        await album.save();

        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar la canción.", details: error.message });
    }
});

// DELETE - Eliminar una canción de un álbum (solo usuarios logueados)
router.delete('/:albumId/canciones/:cancionId', verifyToken, async (req, res) => {
    try {
        const album = await Album.findById(req.params.albumId);
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" });
        }

        // Verificamos que el usuario logueado sea el propietario del álbum
        if (album.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "No tienes permiso para eliminar canciones de este álbum" });
        }

        const cancionIndex = album.canciones.findIndex(c => c._id.toString() === req.params.cancionId);
        if (cancionIndex === -1) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }

        album.canciones.splice(cancionIndex, 1);
        await album.save();

        res.status(200).json({ message: "Canción eliminada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar la canción" });
    }
});

module.exports = router;
