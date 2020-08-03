const messagesRouter = require('./messages-router');
const router = require('express').Router();

router.use('/messages', messagesRouter);

module.exports = router;
