const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Asegúrate de que estás obteniendo el token de las cookies

    if (!token) {
        return res.status(401).send({ message: 'No autenticado' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Token inválido' });
        }

        req.userId = decoded.id; // Guarda el ID del usuario en la solicitud
        next(); // Pasa al siguiente middleware o ruta
    });
};

module.exports = verifyToken;
