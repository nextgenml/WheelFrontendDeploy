const { TwitterApi, TwitterV2IncludesHelper } = require("twitter-api-v2");
const config = require("../../config.js");

let twitterClient = new TwitterApi(config.TWITTER_DEV_TOKEN);
const readOnlyClient = twitterClient.readOnly;

const searchTweets = async () => {
  const jsTweets = await readOnlyClient.v2.search(
    "Am confused how can someone bath today in this weather -is:retweet",
    {
      "tweet.fields": ["conversation_id"],
      expansions: "author_id",
      "user.fields": ["location", "name"],
      max_results: 100,
    }
  );

  const includes = new TwitterV2IncludesHelper(jsTweets);

  for await (const tweet of jsTweets) {
    const data = includes.author(tweet);
    console.log(tweet, data);
  }
};

const tweetLikedUsers = async () => {
  const jsTweets = await readOnlyClient.v2.tweetLikedBy("1607679115536072704", {
    asPaginator: true,
    max_results: 100,
  });

  for await (const tweet of jsTweets) {
    console.log(tweet);
  }
};

const retweetedUsers = async () => {
  const jsTweets = await readOnlyClient.v2.tweetRetweetedBy(
    "1607679115536072704",
    {
      asPaginator: true,
      max_results: 100,
    }
  );

  let count = 0;
  for await (const tweet of jsTweets) {
    console.log(tweet);
  }
  console.log("count", count);
};

const tweetReplies = async () => {
  const jsTweets = await readOnlyClient.v2.search(
    "conversation_id:1607679115536072704",
    {
      "tweet.fields": ["conversation_id"],
      expansions: "author_id",
      "user.fields": ["location", "name"],
      max_results: 100,
    }
  );

  const includes = new TwitterV2IncludesHelper(jsTweets);

  for await (const tweet of jsTweets) {
    const data = includes.author(tweet);
    console.log(tweet, data);
  }
};
// searchTweets();
// tweetLikedUsers();
// retweetedUsers();
tweetReplies();

module.exports = {
  searchTweets,
  tweetLikedUsers,
  retweetedUsers,
  tweetReplies,
};
