const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // HTTP 모듈 추가
const app = express();
const server = http.createServer(app);

const userRoutes = require('./src/api/routes/userRoutes');
const postRoutes = require('./src/api/routes/postRoutes');
const commentRoutes = require('./src/api/routes/commentRoutes');
const db = require('./src/config/db');

const io = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json({
  limit: "200mb"
}));

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

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

const admin = require("firebase-admin");

// Firebase 프로젝트 설정에서 다운로드한 서비스 계정 키 파일을 사용하여 초기화합니다.
var serviceAccount = require("./hackathon.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림을 보낼 토큰. 이 값은 앱에서 생성된 토큰입니다.
const token =
  "cvHt9CHxQBCLo0H3eQxkXB:APA91bGB0loVW-aE2z2QFItzMVhpexGjAbFhG4N-gRJXra8gS5_wEQf0CTggkAlHoF6vPCKlarDn-URmGsUNmiArmSV7AEXG7UbeKj2aO-4RKcoyLSQzoXcOUhXXX0sD0CBFT7_q8VN7";

const message = {
  notification: {
    title: "이음",
    body: "정해준님이 12시간 이상 휴대폰 잠금을 해제하지 않았어요! 정해준님에게 연락해보시길 바랍니다.",
  },
  token: token,
};

// 메시지를 보냅니다.
const executeTask = () => {
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // 성공적으로 메시지를 보냈을 때의 처리
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      // 메시지를 보내는데 실패했을 때의 처리
      console.log("Error sending message:", error);
    });
};

setInterval(executeTask, 300000); // 300000ms = 5분

// 스크립트 시작 시 executeTask 함수를 즉시 실행 (선택사항)
executeTask();