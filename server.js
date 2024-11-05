const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index'); // Importa el archivo de rutas principal
const userRoutes = require('./routes/user'); // Asegúrate de importar el archivo de rutas de usuario
const path = require("path");
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log(process.env.DATABASE_URL); 
const app = express();
const url = process.env.DATABASE_URL; 

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public"))); // Sirve archivos estáticos desde la carpeta Public
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', routes); // Usa el router definido en routes/index.js
app.use('/user', userRoutes); // Asegúrate de usar el router de usuarios aquí

// Función para conectar a MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(url); // Aquí cambiamos `URL` por `url`
        console.log('Conectado a la base de datos');

        app.listen(5000, () => {
            console.log('Servidor escuchando en el puerto 5000 y DB');
        });
    } catch (error) {
        console.log('Error al conectar a la base de datos:', error);
    }
};

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Llama a la función de conexión a MongoDB
connectToMongo();
