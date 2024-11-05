// routes/user.js
const express = require('express');
const User = require('../models/user.js'); // Asegúrate de que la ruta sea correcta
const hashPassword = require('./hashPassword.js'); // Importación directa de hashPassword
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); // Importa cookie-parser
const verifyToken = require('../middleware/auth'); 

const router = express.Router();
const secret = "1234";

// Middleware para parsear cookies
router.use(cookieParser()); // Agrega este middleware

// Función para verificar la contraseña
const checkPassword = async (pass, dbpass) => {
    const match = await bcrypt.compare(pass, dbpass);
    console.log('RESULTADO MATCH', match);
    return match; 
};

// Ruta para crear un usuario
router.post('/', async (req, res) => {
    const { password, email, nombre, apellido } = req.body; // Extraer datos del body

    console.log("COOKIES", req.cookies); // Muestra las cookies en la consola

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).send("Este email ya está registrado."); // Respuesta si el usuario ya existe
        }

        // Hashear la contraseña
        const hashedPassword = await hashPassword(password); 

        // Crear un nuevo usuario
        const user = new User({ 
            nombre,
            apellido,
            email,
            password: hashedPassword
        });

        await user.save(); // Guardar el usuario en la base de datos

        // Crear el payload para el token
        const payload = {
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            id: user._id.toString(),
        };
        
        // Generar el token
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });
        
        // Configurar la cookie con el token
        res.cookie('token', token, { httpOnly: true });
        
        // Respuesta exitosa con el token
        res.status(201).send({ message: "Usuario creado correctamente", token });

    } catch (error) {
        console.error(error); // Mostrar error en la consola
        res.status(500).send("Error al crear el usuario: " + error.message); // Enviar el mensaje de error
    }
});

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-contraseña'); // Excluir contraseña
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los usuarios");
    }
});

// Ruta para obtener un usuario por ID, excluyendo la contraseña
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

// Ruta para actualizar un usuario por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-contraseña');
        if (!updatedUser) return res.status(404).send("Usuario no encontrado");
        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar el usuario");
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

// Ruta protegida para obtener datos del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // ID del usuario desde el token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    try {
        // 1. Buscar el usuario por email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
        }

        // 2. Comparar la contraseña ingresada
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
        }

        // 3. Si la contraseña es correcta, crear el payload y el token
        const payload = {
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            id: user._id.toString(), // Asegúrate de que esto sea una cadena
        };
        
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        // 4. Configurar la cookie con el token y responder con el payload
        res.cookie('token', token, { httpOnly: true, secure: true }); // Asegúrate de establecer secure: true en producción
        res.status(200).send(payload); // Envía el payload al cliente
    } catch (error) {
        console.error("Error en el proceso de autenticación:", error);
        res.status(500).send({ message: 'Error en el proceso de autenticación' }); // Cambia a 500 en caso de error en el servidor
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    try {
        // Elimina la cookie con el token
        res.clearCookie('token');
        // Devuelve un estado 204 (No Content)
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al cerrar sesión' });
    }
});

// Ruta protegida que requiere autenticación
router.get('/protected-route', verifyToken, (req, res) => {
    res.status(200).send(`Bienvenido, ${req.user.nombre}`);
});

// Ruta para validar la sesión
router.get('/validate', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ isAuthenticated: false });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ isAuthenticated: false });
        }
        res.send({ isAuthenticated: true, user: decoded });
    });
});

// Exportar el router de usuarios
module.exports = router;
