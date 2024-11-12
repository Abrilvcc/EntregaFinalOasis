const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo esté correctamente definido
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const hashPassword = require('./hashPassword'); // Si tienes una función para hashear contraseñas
const router = express.Router();

// Función para verificar la contraseña
const checkPassword = async (pass, dbpass) => {
    const match = await bcrypt.compare(pass, dbpass);
    return match;
};

// Ruta para crear un usuario (registro)
router.post('/', async (req, res) => {
    const { password, email, nombre, apellido } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Este email ya está registrado.");
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({
            nombre,
            apellido,
            email,
            password: hashedPassword
        });

        await user.save();

        const payLoad = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
        };
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Asegúrate de usar HTTPS en producción (Render lo maneja automáticamente)
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).send({ message: "Usuario creado correctamente", token });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el usuario: " + error.message);
    }
});

// Ruta para iniciar sesión (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Email o contraseña incorrectos.");
        }

        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Email o contraseña incorrectos.");
        }

        const payLoad = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
        };
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).send({ message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al iniciar sesión: " + error.message);
    }
});

// Ruta para verificar si el usuario está logueado mediante el token
router.get('/validates', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ isLoggedIn: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    });
    res.json({ message: "Sesión cerrada correctamente" });
});

// Ruta para actualizar el perfil del usuario
router.post('/actualizarPerfil', verifyToken, async (req, res) => {
    const { nombre, imagen } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioId = decodedToken.id;

        const usuario = await User.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre || usuario.nombre;
        usuario.imagen = imagen || usuario.imagen;

        await usuario.save();

        const nuevoToken = jwt.sign(
            { id: usuario.id, username: usuario.nombre, userImage: usuario.imagen },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', nuevoToken, { httpOnly: true, secure: true });

        res.json({ success: true, message: 'Perfil actualizado con éxito' });

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar el perfil' });
    }
});

module.exports = router;
