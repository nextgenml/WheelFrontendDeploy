const { TwitterApi, TwitterV2IncludesHelper } = require("twitter-api-v2");
const config = require("../../config.js");

let twitterClient = new TwitterApi(config.TWITTER_DEV_TOKEN);
const readOnlyClient = twitterClient.readOnly;

const searchTweets = async (search, start_time, end_time) => {
  const jsTweets = await readOnlyClient.v2.search(`"${search}" -is:retweet`, {
    "tweet.fields": ["conversation_id", "created_at"],
    expansions: "author_id",
    "user.fields": ["name"],
    max_results: 100,
    start_time,
    end_time,
  });

  const includes = new TwitterV2IncludesHelper(jsTweets);

  const result = [];
  for await (const tweet of jsTweets) {
    const data = includes.author(tweet);
    // console.log(tweet, data);
    result.push({
      postId: tweet.id,
      username: data.username,
      postLink: `https://twitter.com/${data.username}/status/${tweet.id}`,
      createdAt: tweet.created_at,
    });
  }

  return result;
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
// searchTweets("javascript");
// tweetLikedUsers();
// retweetedUsers();
// tweetReplies();

module.exports = {
  searchTweets,
  tweetLikedUsers,
  retweetedUsers,
  tweetReplies,
};
