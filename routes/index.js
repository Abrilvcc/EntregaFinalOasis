const express = require('express');
const albumRouter = require('./album');       // Rutas de álbumes
const userRouter = require('./user');         // Rutas de usuarios

const router = express.Router();



// Ruta de prueba
router.get("/", (req, res) => {
    res.status(200).send("RUTA EJECUTADA CORRECTAMENTE");
});

// Usar las rutas de álbum
router.use('/albums', albumRouter); // Cambiado a '/albums' para mantener la estructura REST

// Usar las rutas de usuario
router.use('/user', userRouter);

// Exportar el router y la función hashPassword
module.exports = router
