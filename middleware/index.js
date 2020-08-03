const errorHandler500 = require('./error-handler');
const ensureAuth = require('./ensure-auth');
const validateCredentials = require('./validate-credentials');
const validateRegister = require('./validate-registration');
const validateMessage = require('./validate-message');
const validateIdParam = require('./validate-id-param');
const validateToken = require('./validate-token');

module.exports = {
  errorHandler500,
  ensureAuth,
  validateCredentials,
  validateRegister,
  validateMessage,
  validateIdParam,
  validateToken
};
