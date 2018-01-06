const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const auth0Config = require("config-yml").auth0;

module.exports.checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: auth0Config.jwksUri
    }),

    // Validate the audience and the issuer.
    audience: auth0Config.audience,
    issuer: auth0Config.issuer,
    algorithms: ['RS256']
});

module.exports.checkScopes = jwtAuthz;

module.exports.expressJwtErrorHandling = function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.sendStatus(401);
        next();
    }
    else
        next(err);
}
