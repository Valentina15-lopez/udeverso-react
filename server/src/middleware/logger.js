// src/middleware/logger.js
const logger = (req, res, next) => {
    console.log(`Solicitud recibida para: ${req.url}`);
    next();
};

export default logger;
