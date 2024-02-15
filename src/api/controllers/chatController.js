const Chat = require('../models/Chat');

const chatCtrl = {
  showEveryChat: async (req, res) => {
    const room_id = req.query.room_id;
    try {
      const chats = await Chat.find({ room_id: room_id }).sort('createdAt');
      res.json(chats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  saveChat: async (req, res) => {
    const { room_id, user_id, message } = req.body;
    const chat = new Chat({
      room_id,
      user_id,
      message,
    });

    try {
      const newChat = await chat.save();
      // 추가적으로 채팅방의 마지막 메시지를 업데이트하는 로직이 필요하면 여기에 구현하세요.
      res.status(201).json(newChat);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  makeAllRead: async (req, res) => {
    const { room_id, user_id } = req.body;
    try {
      await Chat.updateMany({ room_id: room_id, user_id: { $ne: user_id } }, { $set: { is_read: true } });
      res.json({ message: 'Updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = chatCtrl;
