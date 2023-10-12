const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/env");
const { createChatgptLog } = require("../repository/chatgpt_log");
const logger = require("../logger");
const FreeKeys = config.CHATGPT_FREE_KEYS;
const PaidKeys = config.CHATGPT_PAID_KEYS;

function randFreeKey(exclude) {
  let randID = Math.floor(Math.random() * FreeKeys.length);

  while (exclude && exclude.includes(randID)) {
    randID = Math.floor(Math.random() * FreeKeys.length);
  }
  return FreeKeys[randID];
}

function randPaidKey(exclude) {
  let randID = Math.floor(Math.random() * PaidKeys.length);

  while (exclude.includes(randID)) {
    randID = Math.floor(Math.random() * PaidKeys.length);
  }

  return PaidKeys[randID];
}
function getOpenAiRequest(prompt) {
  return {
    model: "text-davinci-003",
    prompt: [
      "Where was the last olympics held? Just tell me the year & country?",
      "Which country won the most medals in that? Just tell me the country name",
      "How many medals did they win in that? Just tell me the number",
      "How many gold medals did they win in that? Just tell me the number",
    ],
    temperature: 0.9,
    max_tokens: 4000,
    top_p: 1,
  };
}
async function getResponse(prompt, excludeFree, excludePaid) {
  let key = "";
  try {
    if (
      excludeFree?.length === FreeKeys.length &&
      excludePaid?.length === PaidKeys.length
    ) {
      return;
    }

    if (!excludeFree || excludeFree.length < FreeKeys.length) {
      key = randFreeKey(excludePaid);
    } else {
      key = randPaidKey(excludeFree);
    }
    if (!key || key === "") {
      console.log("no key");
      return;
    }
    const configuration = new Configuration({
      apiKey: key,
    });

    const openai = new OpenAIApi(configuration);
    model_id = "gpt-3.5-turbo";
    messages = [
      {
        role: "user",
        content:
          "Where was the last olympics held? Just tell me the year  & country?",
      },
      {
        role: "assistant",
        content: "\n\nThe last Olympics were held in 2021 in Tokyo, Japan.",
      },
      {
        role: "user",
        content:
          "Which country won the most medals in that? Just tell me the country name",
      },
      {
        role: "assistant",
        content:
          "The country that won the most medals at the 2021 Olympics in Tokyo was the United States.",
      },
      {
        role: "user",
        content:
          "How many medals did they win in that? Just tell me the number",
      },
    ];

    const response = await openai.createChatCompletion({
      model: "text-davinci-003",
      messages,
      temperature: 0.9,
      max_tokens: 4000,
      top_p: 1,
    });
    // console.log(`create new connection`);
    // const openAIRequest = getOpenAiRequest(prompt);

    // console.log("[! Trying] trying paid key: ", key);
    // const completion = await openai.createCompletion(openAIRequest);
    // console.log(completion);
    // console.log("ChatGPT Status:  ", completion.status);
    return response;
  } catch (err) {
    console.log("err", err);
    if (!excludeFree || excludeFree.length < FreeKeys.length) {
      let exclude = [];
      if (excludeFree) {
        exclude = [...excludeFree];
      }
      exclude.push(key);
      console.log("excludeFree", exclude, excludeFree);
      console.log("[! Failed] Tried Free key: ", key);
      return getResponse(prompt, exclude, excludePaid);
    }
    console.log("[! Failed] Tried paid key: ", key);
    let exclude = [];
    if (excludePaid) {
      exclude = [...excludePaid];
    }
    exclude.push(key);
    return getResponse(prompt, excludeFree, exclude);
  }
}
const gptAPI = async () => {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  model_id = "gpt-3.5-turbo";
  messages = [
    {
      role: "user",
      content:
        "Where was the last olympics held? Just tell me the year  & country?",
    },
    {
      role: "assistant",
      content: "\n\nThe last Olympics were held in 2021 in Tokyo, Japan.",
    },
    {
      role: "user",
      content:
        "Which country won the most medals in that? Just tell me the country name",
    },
    {
      role: "assistant",
      content:
        "The country that won the most medals at the 2021 Olympics in Tokyo was the United States.",
    },
    {
      role: "user",
      content: "How many medals did they win in that? Just tell me the number",
    },
  ];

  const response = await openai.createChatCompletion({
    model: "text-davinci-003",
    messages,
    temperature: 0.9,
    max_tokens: 4000,
    top_p: 1,
  });
  return response;
};
const chatGptResponse = async (req, res) => {
  try {
    const { walletId } = req.query;
    let data = await gptAPI(req.body.msg);
    createChatgptLog(walletId, req.body.msg);
    res.send({ result: data });
  } catch (e) {
    logger.error(`error in chatGptResponse: ${e}`);
    res.status(500).send({ error: e.message });
  }
};
module.exports = {
  chatGptResponse,
};
