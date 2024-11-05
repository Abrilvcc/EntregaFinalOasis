const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index'); 
const userRoutes = require('./routes/user'); 
const path = require("path");
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log(process.env.DATABASE_URL); 
const app = express();
const url = process.env.DATABASE_URL; 
const secret = process.env.SECRET_KEY;
console.log(process.env.SECRET_KEY)
// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public"))); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', routes); 
app.use('/user', userRoutes); 

// Función para conectar a MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(url); 
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
