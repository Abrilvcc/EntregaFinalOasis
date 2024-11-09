require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const userRoutes = require('./routes/user');
const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5000; // Utiliza el puerto de la variable de entorno o 5000 por defecto

console.log(process.env.DATABASE_URL);

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use(cookieParser());

// CORS para permitir solicitudes de ciertos orígenes
const allowedOrigins = ['http://localhost:5000'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Permite el envío de cookies
}));


// Rutas principales
app.use('/', routes);
app.use('/user', userRoutes);

// Ruta de salud
app.get("/health", (req, res) => {
    res.sendStatus(200);
});

// Conectar a MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.error("Error de conexión a MongoDB:", error));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT} y escuchando`);
});
