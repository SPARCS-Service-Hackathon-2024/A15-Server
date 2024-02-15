const chatRoomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  last_chat: { type: String, default: '' },
  last_chat_time: { type: Date },
  user1_unread: { type: Number, default: 0 },
  user2_unread: { type: Number, default: 0 },
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;