const router = require('express').Router();
const { messagesController } = require('../controllers');
const { ensureAuth, validateMessage, validateIdParam } = require('../middleware');

router.use(ensureAuth);

router.get('/received', messagesController.handleGetReceivedMessages);

router.get('/sent', messagesController.handleGetSentMessages);

router.post('/', validateMessage, messagesController.handleSendMessage);

router.route('/:id')
      .get(validateIdParam, messagesController.handleGetMessageById)
      .delete(validateIdParam, messagesController.handleDeleteMessageById);

module.exports = router;
