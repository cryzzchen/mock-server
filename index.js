var express = require('express');
var middleware = require('swagger-express-middleware');

var app = express();

middleware('./src/server/json/PetStore.yaml', app, function(err, middleware) {
    // Add all the Swagger Express Middleware, or just the ones you need.
    // NOTE: Some of these accept optional options (omitted here for brevity)
    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
        middleware.mock()
    );

    app.listen(4321, function() {
        console.log('The PetStore sample is now running at http://localhost:4321');
    });
});