const mongoose = require('mongoose');

// Expresión regular para validar el formato del email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Esquema para el modelo de Usuario
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 2, // Al menos 2 caracteres
    },
    apellido: {
        type: String,
        required: true,
        minlength: 2, // Al menos 2 caracteres
    },
    email: {
        type: String,
        required: true,
        unique: true, // El email debe ser único
        validate: {
            validator: function(v) {
                return emailRegex.test(v); 
            },
            message: 'Debes ingresar un mail valido!'  // Mensaje de error si el correo es inválido
        }
    },
    password: {
        type: String,
        required: true,
    },
  
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
