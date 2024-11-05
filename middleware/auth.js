const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // O el método que estés utilizando para almacenar el token
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No estás autenticado.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Almacena la información del usuario verificado
        next(); // Continúa con la siguiente función (ruta)
    } catch (err) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};


module.exports = authenticate; // Exporta el middleware
