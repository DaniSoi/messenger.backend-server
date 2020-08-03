const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverIds: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  } ],
  senderName: { type: String, required: true }, // redundant data for query optimization
  receiverNames: [ { type: String, required: true } ], // redundant data for query optimization
  viewerIds: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  } ],
  subject: { type: String, required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

module.exports = MessageSchema;
