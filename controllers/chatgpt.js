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
    prompt: ("<|endoftext|>" + prompt + "\n--\nLabel:").substring(0, 255),
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
    console.log(`create new connection`);
    const openAIRequest = getOpenAiRequest(prompt);

    console.log("[! Trying] trying paid key: ", key);
    const completion = await openai.createCompletion(openAIRequest);
    console.log(completion);
    console.log("ChatGPT Status:  ", completion.status);
    return completion.data.choices[0].text;
  } catch (err) {
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
const chatGptResponse = async (req, res) => {
  try {
    const { walletId } = req.query;
    let data = await getResponse(req.body.msg);
    createChatgptLog(walletId, req.body.msg);
    res.send({ result: data });
  } catch (e) {
    logger.error(`error in chatGptResponse: ${e}`);
    res.send({ result: data });
  }
};
module.exports = {
  chatGptResponse,
};
