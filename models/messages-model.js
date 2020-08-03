const mongoose = require('mongoose');
const { MessageSchema } = require('./schemas');

const Message = mongoose.model('Message', MessageSchema);

async function getAllSentMessagesByUid (senderId) {
  return Message.find({ senderId: senderId, viewerIds: senderId }, "-viewerIds")
                .sort({ sentAt: -1 });
}

async function getAllReceivedMessagesByUid (receiverId) {
  return Message.find({ receiverIds: receiverId, viewerIds: receiverId }, "-viewerIds")
                .sort({ sentAt: -1 });
}

async function getMessageById (messageId, viewerId) {
  return Message.findOne({
    _id: messageId,
    viewerIds: viewerId
  },  "-viewerIds");
}

async function saveMessage (messageDoc) {
  const message = new Message({ ...messageDoc });

  return message.save();
}

async function deleteMessageById (messageId, viewerId) {
  return Message.findByIdAndUpdate(
    messageId,
    { $pull: { "viewerIds": viewerId } }
  );
}

module.exports = {
  getAllSentMessagesByUid,
  getAllReceivedMessagesByUid,
  getMessageById,
  saveMessage,
  deleteMessageById
};
