const { messagesService } = require('../services');

async function handleGetSentMessages (request, response, next) {
  try {
    const messages = await messagesService.getAllSentMessagesByUid(request.user._id);
    response.send(messages);
  } catch (e) {
    next(e);
  }
}

async function handleGetReceivedMessages (request, response, next) {
  try {
    const messages = await messagesService.getAllReceivedMessagesByUid(request.user._id);
    response.send(messages);
  } catch (e) {
    next(e);
  }
}

async function handleGetMessageById (request, response, next) {
  try {
    const { error, result } = await messagesService.getMessageById(
      request.params.id,
      request.user._id
    );
    if (error) return response.status(400).end(error);

    response.send(result);
  } catch (e) {
    next(e);
  }
}

async function handleSendMessage (request, response, next) {
  try {
    const message = { ...request.body };
    console.log(request.user)
    const { error, result } = await messagesService.sendMessage(message, request.user);
    if (error) return response.status(400).end(error);

    response.status(201).send(result);
  } catch (e) {
    next(e);
  }
}

async function handleDeleteMessageById (request, response, next) {
  try {
    const { error } = await messagesService.deleteMessageById(request.params.id, request.user._id);
    if (error) return response.status(400).end(error);

    response.status(204).end();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  handleGetSentMessages,
  handleGetReceivedMessages,
  handleGetMessageById,
  handleSendMessage,
  handleDeleteMessageById
};
