const { messagesModel } = require('../models');
const emailService = require('./email-service');
const { SMTP_USER, CLIENT_ORIGIN, AUTH_URL } = require('../config');
const axios = require('axios');
const queryString = require('query-string');

async function getAllSentMessagesByUid (senderId) {
  return messagesModel.getAllSentMessagesByUid(senderId);
}

async function getAllReceivedMessagesByUid (receiverId) {
  return messagesModel.getAllReceivedMessagesByUid(receiverId);
}

async function getMessageById (messageId, viewerId) {
  try {
    const result = await messagesModel.getMessageById(messageId, viewerId);
    if (!result) return { error: 'Message not found.' };

    return { result };
  } catch (e) {
    console.error('messagesReducer service - getMessageById, rethrowing: ', e);
    throw e;
  }
}

async function deleteMessageById (messageId, viewerId) {
  try {
    const result = await messagesModel.deleteMessageById(messageId, viewerId);
    if (!result) return { error: 'Message not found.' };

    return {}; // no content 204 will be sent;
  } catch (e) {
    console.error('messagesReducer service - deleteMessage, rethrowing: ', e);
    throw e;
  }
}

async function sendMessage (message, sender) {
  try {
    const { receiverIds, receiverEmails, ...messageContent } = message;
    const receivers = await getUsers({
      ids: receiverIds,
      emails: receiverEmails
    });
    if (!receivers.length) return { error: 'Destination users not found.' };

    const messageDoc = composeMessageDocument(sender, receivers, messageContent);
    const result = await messagesModel.saveMessage(messageDoc);

    // send notifications to receivers, and send a response to client
    // without waiting for the notifications to be sent
    Promise.all(receivers.map(receiver =>
      sendNewMessageNotificationEmail(sender, receiver, result._id)
    )).catch(() => {});

    return { result };
  } catch (e) {
    console.error('messagesReducer service - sendMessage, rethrowing: ', e);
    throw e;
  }
}

async function getUsers ({ ids, emails }) {
  // const userServiceUrl = 'http://localhost:4000/api/users';
  const usersFilterObj = ids ? { ids } : { emails };
  const params = queryString.stringify(usersFilterObj, { arrayFormat: 'bracket' });
  const targetUrl = `${AUTH_URL}?${params}`;

  try {
    const response = await axios.get(targetUrl);
    return response.data;
  } catch (e) {
    if (e.response) return e.response.data;

    console.error(e);
    throw e;
  }
}

const getUserFullName = user => `${user.firstName} ${user.lastName}`;

function composeMessageDocument (sender, receivers, messageContent) {
  const senderName = getUserFullName(sender);
  const receiverNames = receivers.map(receiver => getUserFullName(receiver));
  const receiverIds = receivers.map(receiver => receiver._id);
  const senderId = sender._id;
  const viewerIds = [ ...receiverIds, senderId ];

  return {
    ...messageContent,
    senderId,
    receiverIds,
    senderName,
    receiverNames,
    viewerIds
  };
}

async function sendNewMessageNotificationEmail (sender, receiver, messageId) {
  try {
    const messageUrl = `${CLIENT_ORIGIN}/message/${messageId}`;
    const emailTemplate = {
      from: SMTP_USER,
      to: receiver.email,
      subject: `${sender.firstName} sent you a new message`,
      html: createNewMessageNotificationHTML(getUserFullName(sender), messageUrl),
      text: `You have a new message from ${receiver.firstName}:\n
${messageUrl}`
    };

    await emailService.sendEmail(emailTemplate);
  } catch (e) {
    console.error('messagesReducer service - sendNewMessageNotificationEmail, rethrowing: ', e);
  }
}

const createNewMessageNotificationHTML = (senderName, messageUrl) => (
  `
<div>
<p>You have a new message from <b>${senderName}</b> :</p>
<br/><br/>
<a href="${messageUrl}" 
   style="
   text-decoration: none;
   cursor: pointer; 
   padding: 1em; 
   border: none;
   border-radius: 5px;
   background-color: dodgerblue;
   color: white;
   font-weight: 600"
>
View message
</a>
<br/><br/>
</div>
`
);

module.exports = {
  getAllReceivedMessagesByUid,
  getAllSentMessagesByUid,
  getMessageById,
  sendMessage,
  deleteMessageById,
};
