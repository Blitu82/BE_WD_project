const { expressjwt: jwt } = require('express-jwt');

// instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload', // we'll be able to access the decoded jwt in req.payload
  getToken: getTokenFromHeaders, // the function below to extract the jwt
});

function getTokenFromHeaders(req) {
  // checks if the token is available on the request headers
  // format: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }

  return null;
}

module.exports = { isAuthenticated };
