const mongoose = require('mongoose');

// Expresión regular para validar el formato del email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

email: {
  type: String,
  required: true,
  validate: {
    validator: function(v) {
      return emailRegex.test(v); 
    },
    message: '  Debes ingresar un mail valido!'  // Mensaje de error si el correo es inválido
  }
}

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
        match: [emailRegex, 'Por favor, ingrese un email válido'], // Validación de formato
    },
    contraseña: {
        type: String,
        required: true,
    },
    favoritos: {
        type: [mongoose.Schema.Types.ObjectId], // Array de IDs de álbumes
        ref: 'Album', // Referencia al modelo de Album
    },
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
