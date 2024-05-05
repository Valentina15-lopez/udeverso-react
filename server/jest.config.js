// Usar `export default` en lugar de `module.exports`
export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',  // Usa Babel para transpilación
    },
};
