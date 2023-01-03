const { TwitterApi, TwitterV2IncludesHelper } = require("twitter-api-v2");
const config = require("../../config.js");

let twitterClient = new TwitterApi(config.TWITTER_DEV_TOKEN);
const readOnlyClient = twitterClient.readOnly;

const searchTweets = async (search, start_time, end_time) => {
  const jsTweets = await readOnlyClient.v2.search(`"${search}" -is:retweet`, {
    "tweet.fields": ["conversation_id", "created_at", "attachments"],
    expansions: ["author_id", "attachments.media_keys"],
    "user.fields": ["name"],
    "media.fields": ["url"],
    max_results: 100,
    start_time,
    end_time,
  });

  const includes = new TwitterV2IncludesHelper(jsTweets);

  const result = [];
  for await (const tweet of jsTweets) {
    const author = includes.author(tweet);
    const medias = includes.medias(tweet);
    // console.log(tweet, author, medias);
    result.push({
      postId: tweet.id,
      username: author.username,
      postLink: `https://twitter.com/${author.username}/status/${tweet.id}`,
      createdAt: tweet.created_at,
      imageUrls: medias.filter((x) => x.type == "photo").map((x) => x.url),
    });
  }

  console.log("result", result);
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
      "tweet.fields": ["conversation_id", "attachments"],
      expansions: ["author_id", "attachments"],
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
// searchTweets(
//   "One of the goals for me this year is to travel to 5 countries.And I know with God, it is popsible."
// );
// tweetLikedUsers();
// retweetedUsers();
// tweetReplies();

module.exports = {
  searchTweets,
  tweetLikedUsers,
  retweetedUsers,
  tweetReplies,
};
