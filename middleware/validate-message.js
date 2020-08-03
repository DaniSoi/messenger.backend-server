const Joi = require('@hapi/joi');

const schema = Joi.object({
  receiverIds: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  ),
  receiverEmails: Joi.array().items(
    Joi.string().email({ minDomainSegments: 2 })
  ),
  subject: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).max(10000).required()
}).xor('receiverIds', 'receiverEmails');

function validateMessage (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
}

module.exports = validateMessage;
