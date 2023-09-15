const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/env");

function randomKey(keys) {
  let randID = Math.floor(Math.random() * keys.length);

  return keys[randID];
}

const getData = async (messages, keys) => {
  if (keys.length === 0)
    throw "all keys are tried for fetching response from chatgpt";
  const key = randomKey(keys);
  try {
    const configuration = new Configuration({
      apiKey: key,
    });
    const openAi = new OpenAIApi(configuration);
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages,
      temperature: 0.9,
      max_tokens: 4000,
      top_p: 1,
    });

    return response.data.choices[0].message;
  } catch (err) {
    console.log("get chatgpt data error", err);
    keys = keys.filter((x) => x !== key);
    return getData(messages, keys);
  }
};

const chatGptResponse = async (messages) => {
  const data = await getData(messages, config.CHATGPT_PAID_KEYS);
  return data;
};
// chatGptResponse("program for swapping of numbers");
module.exports = {
  chatGptResponse,
};
