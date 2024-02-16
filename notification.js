const admin = require("firebase-admin");

// Firebase 프로젝트 설정에서 다운로드한 서비스 계정 키 파일을 사용하여 초기화합니다.
var serviceAccount = require("./hackathon.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림을 보낼 토큰. 이 값은 앱에서 생성된 토큰입니다.
const token =
  "cRHGt5QdR36yHqBE7DTRUn:APA91bHofV-1dLv_DKypfu6Ri1zGQC7f2rWQGGGdMD6_ELsUGSKVq6BIGYfc1mMNYv-PzIZQ1jrLs1FD2UFbTB6LHkMQSfpKpEMSFu3iNjff_EGeVaM9r9-qMhYwmJxSYKr8O6ffPQ32";

const message = {
  notification: {
    title: "이음",
    body: "정해준님이 12시간 이상 휴대폰 잠금을 해제하지 않았어요! 정해준님에게 연락해보시길 바랍니다.",
  },
  token: token,
};

// 메시지를 보냅니다.
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
