const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger-new.json';
const endPointFiles = ['./server.js']
swaggerAutogen(outputFile,endPointFiles);