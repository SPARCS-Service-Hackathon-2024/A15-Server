const axios = require("axios");
const cheerio = require("cheerio");

// 아래 portalCrawler로 복지, 채용, 금융, 주거, 문화 크롤링
// 복지: https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=2&dpmSectionScd=10&commonMenuNo=79_92
// 채용: https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=1&dpmSectionScd=4&commonMenuNo=36_37
// 금융: https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=1&dpmSectionScd=8&commonMenuNo=36_281
// 주거: https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=2&dpmSectionScd=9&commonMenuNo=79_80
// 문화: https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=2&dpmSectionScd=11&commonMenuNo=79_112

const URLs = [
  "https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=2&dpmSectionScd=10&commonMenuNo=79_92",
];

function portalCrawler() {
  const URL = `https://www.daejeonyouthportal.kr/biz/businessIntro.do?dpmSectionFst=2&dpmSectionScd=10&commonMenuNo=79_92`;
  const dataList = [];
  axios
    .get(URL)
    .then((response) => {
      const $ = cheerio.load(response.data);

      $(".bd_thum.type01.type_biz li").each((index, element) => {
        const title = $(element).find(".cont_tit span").text().trim();
        const status = $(element).find(".state_04").text().trim();
        const link = $(element).find("a").attr("href");
        const imgSrc = $(element).find(".info_thum i img").attr("src");

        let applyPeriod = "";
        $(".cont_etc span").each((index, spanElement) => {
          const spanText = $(spanElement).text().trim();
          if (spanText.includes("신청기간")) {
            applyPeriod = $(spanElement).find("i").text().trim();
          }
        });

        const data = {
          title: title,
          link: link,
          status: status,
          imgSrc: imgSrc,
          applyPeriod: applyPeriod,
        };

        dataList.push(data);
      });
      console.log(dataList);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

portalCrawler();

// // 복지 페이지에 이용
// function healingCrawler() {
//   const URL = "https://daejeon.pass.or.kr/healing.es?mid=a10102000000";
//   const dataList = [];

//   axios
//     .get(URL)
//     .then((response) => {
//       const $ = cheerio.load(response.data);

//       $(".dbody ul").each((index, element) => {
//         const title = $(element).find(".title a").text().trim();
//         const status = $(element).find(".state.ing").text().trim();
//         const applyPeriod = $(element).find(".W20.m-br").eq(0).text().trim();
//         const link = $(element).find(".title a").attr("href");

//         const data = {
//           title: title,
//           status: status,
//           applyPeriod: applyPeriod,
//           link: link,
//         };

//         dataList.push(data);
//       });

//       console.log(dataList);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// }

// healingCrawler();
