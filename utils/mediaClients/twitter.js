const { TwitterApi, TwitterV2IncludesHelper } = require("twitter-api-v2");
const config = require("../../config.js");

let twitterClient = new TwitterApi(config.TWITTER_DEV_TOKEN);
const readOnlyClient = twitterClient.readOnly;

const searchTweets = async (search, start_time, end_time) => {
  console.log("searching in twitter", search);
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
      followLink: `https://twitter.com/${author.username}`,
      userId: author.id,
    });
  }

  console.log("result", result);
  return result;
};

const tweetLikedUsers = async (postId, start_time, end_time) => {
  const users = await readOnlyClient.v2.tweetLikedBy(postId, {
    asPaginator: true,
    max_results: 100,
  });

  const result = [];
  for await (const user of users) {
    result.push({
      username: user.username,
    });
  }

  return result;
};

const retweetedUsers = async (postId, start_time, end_time) => {
  const users = await readOnlyClient.v2.tweetRetweetedBy(postId, {
    asPaginator: true,
    max_results: 100,
  });

  const result = [];
  for await (const user of users) {
    result.push({
      username: user.username,
    });
  }
  return result;
};

const tweetRepliedUsers = async (postId, start_time, end_time) => {
  const jsTweets = await readOnlyClient.v2.search(`conversation_id:${postId}`, {
    "tweet.fields": ["conversation_id", "created_at"],
    expansions: ["author_id"],
    "user.fields": ["location", "name"],
    max_results: 100,
    start_time,
    end_time,
  });

  const includes = new TwitterV2IncludesHelper(jsTweets);

  const result = [];
  for await (const tweet of jsTweets) {
    const data = includes.author(tweet);
    // console.log("result", data, tweet);
    result.push({
      username: data.username,
      createdAt: tweet.created_at,
    });
  }
  // console.log("result", result);
  return result;
};

const getTwitterActionFunc = (action) => {
  switch (action) {
    case "like":
      return tweetLikedUsers;
    case "retweet":
      return retweetedUsers;
    case "comment":
      return tweetRepliedUsers;
  }
};

const followingUsers = async (userId) => {
  const users = await readOnlyClient.v2.following(userId, {
    asPaginator: true,
    max_results: 100,
  });

  const result = [];
  for await (const user of users) {
    result.push({
      username: user.username,
    });
  }
  return result;
};

const sanitizeTweet = (tweet) => tweet.replace(/\s\[https\:.*]/gm, "");

const x = `I know you havent forgotten about $LIT!! We're going to be dropping our whitepaper soon! plus our first ever video teaser of #LITSWAP in action will b released feb. 21st! 

SAY GOODBYE TO PERCENTAGE BASED FEES AND TAXES!!! 

TRADE P2P SAFE & SECURELY! 

ONE LOW FEE! THATS $LIT!`;

// searchTweets(x);
// tweetLikedUsers();
// retweetedUsers("1607679115536072704");
// tweetRepliedUsers("1607679115536072704");
// followingUsers("1452687837808107520");
module.exports = {
  searchTweets,
  tweetLikedUsers,
  retweetedUsers,
  tweetRepliedUsers,
  getTwitterActionFunc,
  followingUsers,
  sanitizeTweet,
};
