const cityArray = ["Florida"];
const greetingArray = ["I would like to book an appointment"];

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
};
{/* 
  type 1 for the message response 
  type 2 for the Message with options
  type 3 for the error message disease 
  type 4 for the last Checkout message
*/}

const questionArray = [
  {
    type: 1,
    message: "Thanks for getting in touch with us at Telemedicine today.",
  },
  {
    type: 1,
    message:
      "We are here to help you build your wellness so that you are healthy today and tomorrow.",
  },
  {
    type: 2,
    message: "Please select what you need help with:",
    option: greetingArray,
  },
  { type: 1, message: "Sure, we can help you with that." },
  { type: 1, message: "To begin with, please tell us your full name." },
  { type: 2, message: "Please select your state:", option: cityArray },
  { type: 2, message: "Please select your Medical Condition:", option: "" },
  {
    type: 2,
    message:
      "Kindly mention the specialty for which you are seeking medical attention:",
    option: "",
  },
  { type: 4, message: "Thank you Visting Telemedicine." },
];

module.exports = {
  cityArray,
  greetingArray,
  questionArray,
  corsOptions,
};
