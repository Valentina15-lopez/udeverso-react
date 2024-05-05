import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'udeverso-react-api',
            version: '1.0.0',
            description: 'Esta es la documentación del API del udeverso-react',
            contact: {
                name: 'Mathias Nieres',
                email: 'mathiasnieres@gmail.com'
            },
            servers: ['http://localhost:3001']
        }
    },
    apis: ['./src/routes/*.js'] // ruta de los archivos donde se encuentra la documentación de la API
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;