const express = require('express');
const User = require('../models/user.js'); // Asegúrate de que la ruta sea correcta
const hashPassword = require('./hashPassword.js'); // Importación directa de hashPassword
const bcrypt = require('bcrypt');

const router = express.Router();

// Función para verificar la contraseña
const checkPassword = async (pass, dbpass) => {
    const match = await bcrypt.compare(pass, dbpass);
    console.log('RESULTADO MATCH', match);
    return match; 
};

// Ruta para crear un usuario (registro)
router.post('/', async (req, res) => {
    const { password, email, nombre, apellido } = req.body; // Extraer datos del body

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Este email ya está registrado.");
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

        res.status(201).send({ message: "Usuario creado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el usuario: " + error.message);
    }
});

// Ruta para iniciar sesión (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extraer datos del body

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Email o contraseña incorrectos.");
        }

        // Verificar la contraseña
        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Email o contraseña incorrectos.");
        }

        // Si todo está bien, devolver un mensaje de éxito
        res.status(200).send({ message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al iniciar sesión: " + error.message);
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
        console.log("ID recibido en la ruta /:id:", req.params.id);
        
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

// Exportar el router de usuarios
module.exports = router;
