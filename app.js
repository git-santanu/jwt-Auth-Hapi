'use strict';
require('dotenv').config();
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const server = require('./config/server');
const baseRouter = require('./routes');
const Pack = require('./package')
const { jwtAuthentication } = require('./controllers/auth');
const init = async () => {
    await jwtAuthentication(server);
    const swaggerOptions = {
        documentationPath: '/docs',
        basePath: '/api',
        info:{
            title:'Test API Documentation with authentication',
            version:Pack.version,
        },
        securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            }
        },
        security: [{ jwt: [] }],
        schemes: ['http','https']
    }
    // Adding plugins for swagger docs;
    await server.register([
        Inert,
        Vision,
        {
            plugin:HapiSwagger,
            options:swaggerOptions
        }
    ])
    await server.register(baseRouter,{
		routes:{
			prefix:'/api'
		}
	});

    server.events.on('response', function (request) {
        console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();