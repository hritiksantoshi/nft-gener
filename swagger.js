const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger.json';
const endPointFiles = ['./Routes/UserRoutes.js']
swaggerAutogen(outputFile,endPointFiles);