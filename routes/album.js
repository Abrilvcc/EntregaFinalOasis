const express = require('express');
const Album = require('../models/album.js');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// CRUD

// CREATE - Agregar un álbum (solo usuarios logueados)
router.post('/', verifyToken, async (req, res) => {
    try {
        // Asociamos el álbum al usuario logueado
        req.body.user = req.user.id;
        await Album.create(req.body);
        res.status(201).send("Álbum agregado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear el álbum");
    }
});

// GET ALL - Traer todos los álbumes (sin necesidad de verificación de token)
router.get('/', async (req, res) => {
    try {
        const result = await Album.find({});
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(404).send("No data");
    }
});

// GET POR ID - Obtener un álbum por ID
router.get('/:id', async (req, res) => {
    try {
        const result = await Album.findById(req.params.id);
        if (!result) {
            return res.status(404).send("Álbum no encontrado");
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al buscar el álbum");
    }
});

// UPDATE - Actualizar un álbum por ID (solo usuarios logueados)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const newInfo = req.body;

        // Verificamos que el álbum pertenezca al usuario logueado
        const album = await Album.findById(id);
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }
        if (album.user.toString() !== req.user.id) { // Verificamos el propietario
            return res.status(403).send("No tienes permiso para editar este álbum");
        }

        const updatedAlbum = await Album.findByIdAndUpdate(id, newInfo, { new: true });
        if (!updatedAlbum) {
            return res.status(404).send("Álbum no encontrado para actualizar");
        }
        res.status(200).send("Elemento actualizado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error en la actualización");
    }
});

// DELETE - Eliminar un álbum por ID (solo usuarios logueados)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        // Validamos que el álbum pertenezca al usuario logueado
        const album = await Album.findById(id);
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }
        if (album.user.toString() !== req.user.id) {
            return res.status(403).send("No tienes permiso para eliminar este álbum");
        }

        await Album.findByIdAndDelete(id);
        res.status(200).send("Elemento eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error en la eliminación");
    }
});

// CREATE - Agregar una canción a un álbum (solo usuarios logueados)
router.post('/:id/canciones', verifyToken, async (req, res) => {
    const { nombreDeCancion, enlaceYouTube } = req.body;

    // Verificamos que los campos obligatorios estén presentes
    if (!nombreDeCancion || !enlaceYouTube) {
        return res.status(400).json({ error: "Los campos 'nombreDeCancion' y 'enlaceYouTube' son obligatorios." });
    }

    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado." });
        }

        // Verificamos que el usuario logueado sea el propietario del álbum
        if (album.user.toString() !== req.user.id) {
            return res.status(403).send("No tienes permiso para agregar canciones a este álbum");
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
            return res.status(404).send("Álbum no encontrado");
        }

        // Verificamos que el usuario logueado sea el propietario del álbum
        if (album.user.toString() !== req.user.id) {
            return res.status(403).send("No tienes permiso para eliminar canciones de este álbum");
        }

        const cancionIndex = album.canciones.findIndex(c => c._id.toString() === req.params.cancionId);
        if (cancionIndex === -1) {
            return res.status(404).send("Canción no encontrada");
        }

        album.canciones.splice(cancionIndex, 1);
        await album.save();

        res.status(200).send("Canción eliminada correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar la canción");
    }
});

module.exports = router;
