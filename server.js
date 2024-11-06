require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index'); 
const userRoutes = require('./routes/user'); 
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authenticate = require('./middleware/authenticate'); // Importa el middleware de autenticación

console.log(process.env.DATABASE_URL); 
const app = express();
const url = process.env.DATABASE_URL; 

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public"))); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: ['https://proyectobandaoasis.onrender.com'],
    credentials: true,
}));


// Rutas
app.use('/', routes); 
app.use('/user', authenticate, userRoutes); 
app.use('/user', userRoutes);

// Ruta de salud
app.use("/health", (req, res) => {
    res.sendStatus(200); 
});

// Función para conectar a MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(url); 
        console.log('Conectado a la base de datos');

        // Utilizar el puerto dinámico de Render
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT} y DB`);
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
