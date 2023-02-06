const axios = require("axios");

const chatGptResponse = async (query) => {
  let payload = { msg: query };

  let res = await axios.post(
    "https://backend.chatbot.nexgenml.com/collections",
    payload
  );

  let data = res.data;
  console.log(data);
};

module.exports = {
  chatGptResponse,
};
// chatGptResponse(
//   "rewrite the sentence in 20 words - Axios automatically serializes JavaScript objects to JSON when passed to the post function as the second parameter; we do not need to serialize POST bodies to JSON"
// );
