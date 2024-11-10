const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Obtiene el token desde las cookies

    if (!token) {
        return res.status(401).send("Acceso denegado: No se proporcionó un token");
    }

    try {
        // Verifica y desencripta el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate de que JWT_SECRET esté definido en el entorno
        req.user = decoded; // Agrega la información del usuario a la solicitud
        next();
    } catch (error) {
        res.status(401).send("Token no válido o expirado");
    }
};

module.exports = verifyToken;
