require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const userRoutes = require('./routes/user');
const albumRoutes = require('./routes/album');

const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Agregar jsonwebtoken
const app = express();
const PORT = process.env.PORT || 5000; // Utiliza el puerto de la variable de entorno o 5000 por defecto

console.log(process.env.DATABASE_URL);

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use(cookieParser());

// Configuración de CORS para permitir solicitudes de ciertos orígenes
const allowedOrigins = ['http://localhost:5000', 'https://proyectobandaoasis.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes de orígenes permitidos o solicitudes sin origen (por ejemplo, desde el mismo servidor en producción)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,  // Permite el envío de cookies
}));

// Ruta para obtener la información del usuario logueado
app.get('/me', (req, res) => {
    try {
        const token = req.cookies.token;  // Obtener el token de las cookies
        if (!token) {
            return res.status(401).send('No se proporcionó un token');  // Si no existe el token, devuelve error 401
        }

        // Verificar el token utilizando la clave secreta del entorno
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token es válido, enviamos la información del usuario
        res.status(200).send(payload);
    } catch (error) {
        // Si hay un error en la verificación o el token es inválido
        res.status(401).send('No autorizado');
    }
});

// Rutas principales
app.use('/', routes);
app.use('/user', userRoutes);
app.use('/albums', albumRoutes); 
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
