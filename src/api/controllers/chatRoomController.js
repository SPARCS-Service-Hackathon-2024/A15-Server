// controllers/chatRoomCtrl.js
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Post = require('../models/Post');

const chatRoomCtrl = {
  makeChatRoom: async (req, res) => {
    try {
      const { user1_id, user2_id } = req.body;

      const newChatRoom = new ChatRoom({
        users: [user1_id, user2_id],
      });

      await newChatRoom.save();

      // 새로 생성된 채팅방 정보 반환
      const populatedChatRoom = await newChatRoom.populate('users post');

      res.json(populatedChatRoom);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  showEveryChatRoom: async (req, res) => {
    try {
      const chatRooms = await ChatRoom.find().populate('users post').sort({ _id: -1 });
      res.json(chatRooms);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  // updateLastChat와 updateUnread는 MongoDB의 update 메서드를 사용하여 구현 필요

};
