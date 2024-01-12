const axios = require("axios");
const { questionArray } = require("./config");
require("dotenv").config();

const { API_URL, HEADER_TOKEN } = process.env;

const fetchMedicalDisease = async () => {
  try {
    const { data } = await axios.get(API_URL, {
      headers: {
        Telemedicineauth: HEADER_TOKEN,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const validateName = (name = "") => {
  name = name.trim();
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name);
};

const emitQuestions = (socket, activeQuestion, stopProcess) => {
  switch (true) {
    case !stopProcess:
      socket.emit("general", questionArray[activeQuestion.value]);
      activeQuestion.value++;
      setTimeout(() => {
        socket.emit("general", questionArray[activeQuestion.value]);
        activeQuestion.value++;
      }, 300);
      setTimeout(() => {
        socket.emit("general", questionArray[activeQuestion.value]);
      }, 600);
      break;

    case stopProcess:
      socket.emit("general", {
        type: 3,
        message: "Sorry for the inconvenience, the system is down.",
      });
      break;
  }
};

const socketEmit = (socket, data) => {
  setTimeout(() => {
    socket.emit("general", data);
  }, 1000);
};

module.exports = {
  fetchMedicalDisease,
  emitQuestions,
  validateName,
  socketEmit,
};
