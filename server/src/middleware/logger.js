// src/middleware/logger.js
const logger = (req, res, next) => {
    //console.log(`Solicitud recibida para: ${req.url}`); // Loggear la URL de la solicitud
    next(); // Llamar a la siguiente función en la cadena de middleware
};

export default logger;
