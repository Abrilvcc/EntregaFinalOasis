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
const PORT = process.env.PORT || 5000; // Utiliza el puerto de la variable de entorno o 5000 por defecto

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: 'https://proyectobandaoasis.onrender.com',
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

// Conectar a MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.log("Error de conexión a MongoDB:", error));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT} y escuchando DB`);
});
