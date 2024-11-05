const express = require('express');
const Album = require('../models/album.js');  
const path = require('path');
const router = express.Router();
const hashPassword = require('./hashPassword.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const verifyToken = require('../middleware/authenticate.js');
// CRUD

// CREATE - Agregar un álbum
router.post('/', async (req, res) => {
    try {
        await Album.create(req.body);
        res.status(201).send("Álbum agregado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear el álbum");
    }
});

// GET ALL - Traer todos los álbumes
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
    console.log("ID del álbum recibido:", req.params.id);
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

// UPDATE - Actualizar un álbum por ID
router.put('/:id', async (req, res) => {
    console.log("ID recibido para actualización:", req.params.id);
    try {
        const id = req.params.id;
        const newInfo = req.body;
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

// DELETE - Eliminar un álbum por ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Album.findByIdAndDelete(id);
        res.status(200).send("Elemento eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error en la eliminación");
    }
});

// GET POR NOMBRE
router.get('/titulo/:titulo', async (req, res) => {
    try {
        const result = await Album.find({ titulo: req.params.titulo });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(404).send("No data");
    }
});

// CREATE - Agregar una canción a un álbum
router.post('/:id/canciones', async (req, res) => {
    console.log("Datos recibidos en la solicitud:", req.body);

    const { nombreDeCancion, enlaceYouTube } = req.body; // Manteniendo enlaceYouTube como campo

    // Verifica que se reciban los campos necesarios
    if (!nombreDeCancion || !enlaceYouTube) {
        console.log("Faltan campos obligatorios:", { nombreDeCancion, enlaceYouTube });
        return res.status(400).json({ error: "Los campos 'nombreDeCancion' y 'enlaceYouTube' son obligatorios." });
    }

    try {
        const album = await Album.findById(req.params.id);
        console.log("Álbum encontrado:", album);
        
        if (!album) {
            console.log("Álbum no encontrado con ID:", req.params.id);
            return res.status(404).json({ error: "Álbum no encontrado." });
        }

        // Agregar la nueva canción al álbum
        album.canciones.push({ nombreDeCancion, enlaceYouTube });
        await album.save(); // Guarda el álbum actualizado

        console.log("Álbum actualizado:", album);
        res.status(201).json(album); // Responde con el álbum actualizado
    } catch (error) {
        console.error("Error al agregar la canción:", error);
        res.status(500).json({ error: "Error al agregar la canción.", details: error.message });
    }
});

// GET - Obtener canciones de un álbum por ID
router.get('/:id/canciones', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }
        res.status(200).send(album.canciones);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las canciones");
    }
});

// DELETE - Eliminar una canción de un álbum
router.delete('/:albumId/canciones/:cancionId', async (req, res) => {
    try {
        const album = await Album.findById(req.params.albumId);
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }

        // Encuentra el índice de la canción que quieres eliminar
        const cancionIndex = album.canciones.findIndex(c => c._id.toString() === req.params.cancionId);
        if (cancionIndex === -1) {
            return res.status(404).send("Canción no encontrada");
        }

        // Elimina la canción usando el índice
        album.canciones.splice(cancionIndex, 1);
        await album.save();

        res.status(200).send("Canción eliminada correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar la canción");
    }
});



module.exports = router; // Exporta solo el router
