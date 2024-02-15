const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // HTTP 모듈 추가
const server = http.createServer(app);
const userRoutes = require('./src/api/routes/userRoutes');
const db = require('./src/config/db');

const app = express();
const io = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json({
  limit: "200mb"
}));

app.use('/users', userRoutes);

db.connectDatabase();

// 소켓 연결 처리
io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);

  socket.on('disconnect', (input) => {
    console.log(input.room_id);
    console.log('user disconnected');
  });
  // 채팅방 id로 join room
  socket.on("join room", (input) => {
    console.log("Joined room: " + input.room_id + "\n");
    socket.join(input.room_id);
    console.log(socket.adapter.rooms);
  });

  // 메세지 보내면 DB에 저장하고 프론트에 전송
  socket.on("send chat", (input) => {
    console.log("send chat");
    console.log("user_id: " + input.user_id + " msg: " + input.message + "\n");
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
    chatCtrl.makeAllRead(input.room_id, input.user_id);
    chatRoomCtrl.updateLastChat(input.room_id);
    chatRoomCtrl.updateUnread(input.room_id, input.user1_id, input.user2_id);
    socket.leave(input.room_id);
    console.log(socket.adapter.rooms);
    // for (const [id, socket] of io.of("/").sockets) {
    //     socket.disconnect();
    // }
  });
});

const PORT = 5000;
server.listen(PORT, () => { // `app.listen` 대신 `server.listen`을 사용
  console.log(`Server is running on port ${PORT}`);
});
