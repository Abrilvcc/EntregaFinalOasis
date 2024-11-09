const express = require('express');
const User = require('../models/user.js');
const hashPassword = require('./hashPassword.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');
const verifyToken = require('../middlewares/verifyToken');  // Asegúrate de importar el middleware verifyToken

const app = express();
app.use(cookieParser());  // Asegúrate de que cookie-parser esté configurado globalmente

// Función para verificar la contraseña
const checkPassword = async (pass, dbpass) => {
    const match = await bcrypt.compare(pass, dbpass);
    console.log('RESULTADO MATCH', match);
    return match;
};

// Ruta para verificar si el usuario está logueado mediante el token
router.get('/validates', verifyToken, async (req, res) => {
    try {
        // Verifica que req.user tiene un valor y que contiene un ID
        console.log("Token validado, req.user:", req.user);

        // Si el token es válido, `req.user` tendrá la información del usuario decodificada
        const user = await User.findById(req.user.id).select('-password');
        console.log("Usuario encontrado:", user);

        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si el usuario existe, devolver la información del usuario y estado de login
        return res.status(200).json({ isLoggedIn: true, user });
    } catch (error) {
        console.error('Error al obtener el usuario:', error.message);
        return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

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

        // Establecer la cookie con el token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Usar 'true' solo en producción
            sameSite: 'None',  // Asegura que la cookie se envíe entre dominios
            maxAge: 24 * 60 * 60 * 1000,  // 1 día
        });

        res.status(201).send({ 
            message: "Usuario creado correctamente",
            token 
        });

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

        // Establecer la cookie con el token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Usar 'secure' solo en producción
            sameSite: 'None',  // Asegura que la cookie se envíe entre dominios
            maxAge: 24 * 60 * 60 * 1000,  // 1 día
        });

        res.status(200).send({ message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al iniciar sesión: " + error.message);
    }
});

// Ruta para obtener todos los usuarios (protegida)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-contraseña');
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los usuarios");
    }
});

// Ruta para obtener un usuario por ID (protegida)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-contraseña');
        if (!user) return res.status(404).send("Usuario no encontrado");
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener el usuario");
    }
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send("Usuario no encontrado");
        res.status(200).send("Usuario eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el usuario");
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Elimina la cookie del token
    res.json({ message: "Sesión cerrada correctamente" });
});

// Exportar el router de usuarios
module.exports = router;
