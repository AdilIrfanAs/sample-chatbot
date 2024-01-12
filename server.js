const cors = require("cors");
const http = require("http");
const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
require("dotenv").config();

const {
  fetchMedicalDisease,
  validateName,
  emitQuestions,
  socketEmit,
} = require("./config/helper");

const {
  cityArray,
  greetingArray,
  questionArray,
  corsOptions,
} = require("./config/config");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/client"));

app.get("/", function (res) {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.use(cors(corsOptions));

let titleArray = [];
let subTittleArray = [];
let urlArray = [];
const userDisease = {};
let byPassFlag = false;
let diseaseIndex = -1;

io.on("connection", async (socket) => {
  let activeQuestion = { value: 0 };
  let stopProcess = false;

  try {
    if (titleArray.length === 0) {
      const { data } = await fetchMedicalDisease();
      for (const item of data) {
        const { title = "", conditions = [] } = item;
        titleArray.push(title);
        const titles = conditions.map((condition) => condition.title);
        const url = conditions.map((condition) => condition.url);
        subTittleArray.push(titles);
        urlArray.push(url);
      }
    }
  } catch (error) {
    stopProcess = true;
    throw error;
  }
  if (titleArray.length > 0) {
    emitQuestions(socket, activeQuestion, stopProcess);
  }

  socket.on("answer", async (data) => {
    socket.emit("typing", { typing: true });
    let invalidResponseMessage = "You have entered an invalid response.";
    let invalid = false;
    {/* 
      case 2 handles the check for the First response for Please select what you need help with
      case 4 for the Full name
      case 5 for the city name 
      case 6 for the disease check 
      case 7 for the sub-disease check
     */}
    const userResponse = data;
    switch (activeQuestion.value) {
      case 2:
        const indexGreeting = greetingArray.indexOf(userResponse);
        if (indexGreeting === -1) {
          invalid = true;
          invalidResponseMessage = "You have entered an invalid option.";
          activeQuestion.value = 2;
        }
        break;
      case 4:
        const indexName = greetingArray.indexOf(userResponse);
        if (!validateName(userResponse) || indexName !== -1) {
          invalid = true;
          invalidResponseMessage = "You have entered an invalid full name.";
        }
        break;
      case 5:
        const indexCity = cityArray.indexOf(userResponse);
        if (indexCity === -1) {
          invalid = true;
          invalidResponseMessage = "You have selected an invalid state.";
          activeQuestion.value = 5;
        }
        break;
      case 6:
        const indexTitle = titleArray.indexOf(userResponse);
        if (indexTitle === -1) {
          invalid = true;
          invalidResponseMessage = "You have entered an invalid disease.";
        } else {
          userDisease.disease = userResponse;
        }
        break;
      case 7:
        const indexSubDisease = subTittleArray.findIndex((conditions) =>
          conditions.includes(userResponse)
        );
        if (indexSubDisease === -1) {
          invalid = true;
          invalidResponseMessage = "You have entered an invalid sub-disease.";
        }
        break;
    }

    if (!stopProcess) {
      const processCondition = !invalid;

      switch (processCondition) {
        case true:
          switch (activeQuestion.value) {
            case 8:
              stopProcess = true;
              break;
            default:
              if (activeQuestion.value === 6) {
                const checkindex = titleArray.indexOf(userResponse);
                if (subTittleArray[checkindex].length === 0) {
                  byPassFlag = true;
                  activeQuestion.value++;
                }
              }
              activeQuestion.value++;
              break;
          }
          break;
        default:
          socketEmit(socket, {
            type: 3,
            message: invalidResponseMessage,
          });
          break;
      }
      {/* 
        these cases hanlde the respective messages formthe config file we see
        2,5 for the emit 2 & 5
        3 for the emit 3
        4 for the emit 4
        6 for the emit 6
        7 for the verify and emit 7
        8 for the verify and emit 8
      */}
      if ([2, 5].includes(activeQuestion.value)) {
        socketEmit(socket, questionArray[activeQuestion.value]);
      }
      if ([3].includes(activeQuestion.value)) {
        socketEmit(socket, questionArray[activeQuestion.value]);
        activeQuestion.value++;
      }
      if ([4].includes(activeQuestion.value)) {
        setTimeout(function () {
          socketEmit(socket, questionArray[activeQuestion.value]);
        }, 200);
      }
      else if ([6].includes(activeQuestion.value)) {
        const diseaseArraylength = titleArray.length;
        switch (diseaseArraylength) {
          case 0:
            setTimeout(() => {
              socketEmit(socket, {
                type: 2,
                message: "Please select your Medical Condition:",
                option: titleArray,
              });
            }, 2000);
            break;
          default:
            socketEmit(socket, {
              type: 2,
              message: "Please select your Medical Condition:",
              option: titleArray,
            });
            break;
        }
      }
      else if ([7].includes(activeQuestion.value)) {
        let userDisease = userResponse;
        if (userDisease.disease) {
          userDisease = userDisease.disease;
        }
        const index = titleArray.indexOf(userDisease);
        switch (index) {
          case -1:
            socketEmit(socket, {
              type: 3,
              message: "Please select a valid disease.",
            });
            break;
          default:
            diseaseIndex = index;
            socketEmit(socket, {
              type: 2,
              message:
                "Kindly mention the specialty for which you are seeking medical attention:",
              option: subTittleArray[index],
            });
            break;
        }
      }
      else if ([8].includes(activeQuestion.value)) {
        switch (byPassFlag) {
          case true:
            byPassFlag = false;
            socketEmit(socket, {
              type: 4,
              message: "Thank you for visiting Telemedicine.",
            });
            break;
          default:
            const index = subTittleArray.findIndex((conditions) =>
              conditions.includes(userResponse)
            );
            const indexSubDisease = subTittleArray[index].indexOf(userResponse);

            switch (index) {
              case -1:
                socketEmit(socket, {
                  type: 3,
                  message: "Please select a valid sub-disease.",
                });
                break;
              default:
                socketEmit(socket, {
                  type: 4,
                  message: "Thank you for visiting Telemedicine.",
                  url: urlArray[diseaseIndex][indexSubDisease],
                });
                socketEmit(socket, questionArray[activeQuestion.value]);
                break;
            }
        }
      }
    }
  });

  socket.on("disconnect", () => { });
});

const port = process.env.PORT;
server.listen(port, () => { });
