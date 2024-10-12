const express = require('express');
const mongoose = require('mongoose');
const routes = require('./API/routes/index');

const app = express();
const URL = 'mongodb+srv://abrilvictoria:wMySCPvEGOpzucir@platafdisco.6le6w.mongodb.net/?retryWrites=true&w=majority&appName=PlatafDisco';

app.use(express.json());
app.use('/', routes); // Usa el router definido en routes/index.js

const connectToMongo = async () => {
    try {
        await mongoose.connect(URL);
        console.log('Conectado a la base de datos');

        // Mueve la llamada a app.listen aquí, después de conectarse a MongoDB
        app.listen(5000, () => {
            console.log('Servidor escuchando en el puerto 5000');
        });
    } catch (error) {
        console.log('Error al conectar a la base de datos:', error);
    }
};

// Llama a la función de conexión a MongoDB
connectToMongo();


//wMySCPvEGOpzucir

//  mongodb+srv://abrilvictoria:wMySCPvEGOpzucir@platafdisco.6le6w.mongodb.net/?retryWrites=true&w=majority&appName=PlatafDisco
