import dotenv from 'dotenv'; //importar librería dotenv
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'test'}` });  // Cargar el archivo correspondiente de configuración
import { Sequelize } from 'sequelize';//importar la clase Sequelize

const databaseConfig = { // Configuración de la base de datos
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        dialect: 'postgres',
        logging: false,
    },
};

const currentEnvironment = process.env.NODE_ENV || 'test';  // Entorno por defecto
const sequelizeConfig = databaseConfig[currentEnvironment];  // Configuración según el entorno

const sequelize = new Sequelize( // Crear una instancia de la clase Sequelize
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    {
        host: sequelizeConfig.host,
        dialect: sequelizeConfig.dialect,
        logging: sequelizeConfig.logging,
    }
);

export default sequelize; // Exportar la instancia de la clase Sequelize
