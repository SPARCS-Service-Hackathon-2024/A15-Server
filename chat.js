// chat.js
const chatCtrl = require("./controllers/chatCtrl");
const chatRoomCtrl = require("./controllers/chatRoomCtrl");
// :)
/*
프론트에서 채팅하기 버튼 누르면 방 생성(DB)하고 socket.connect(), 방 id로 join room
메세지 보내면 chat message 이벤트 발생, io.to(room_id).emit("chat message", msg)로 메세지 전송.
chat message 이벤트 받으면 DB에 저장하고 프론트에 전송.
나가면 leave room 하고 socket.disconnect() 
*/

const setUpSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket entered: " + socket.id);
    console.log("A user connected\n");

    io.on("disconnect", (input) => {
      console.log(input.room_id);
      console.log("User disconnected\n");
    });

    // 채팅방 id로 join room
    socket.on("join room", (input) => {
      console.log("Joined room: " + input.room_id+"\n");
      socket.join(input.room_id);
      console.log(socket.adapter.rooms);
    });

    // 메세지 보내면 DB에 저장하고 프론트에 전송
    socket.on("send chat", (input) => {
      console.log("send chat");
      console.log("user_id: " + input.user_id + " msg: " + input.message+"\n");
      const req = {
          room_id: input.room_id,
          user_id: input.user_id,
          message: input.message,
        }
      chatCtrl.saveChat(req);
      console.log("receive chat");
      console.log(input.message);
      socket.to(input.room_id).emit("receive chat", input.message);
    });

    // 나갈 때 DB에 있는 거 다 읽음 처리
    socket.on("leave room", (input) => {
      console.log("Left room: " + input.room_id);
      chatCtrl.makeAllRead(input.room_id,input.user_id);
      chatRoomCtrl.updateLastChat(input.room_id);
      chatRoomCtrl.updateUnread(input.room_id, input.user1_id, input.user2_id);
      socket.leave(input.room_id);
      console.log(socket.adapter.rooms);
      // for (const [id, socket] of io.of("/").sockets) {
      //     socket.disconnect();
      // }
      });
  });
};

module.exports = setUpSocket;