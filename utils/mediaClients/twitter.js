const { TwitterApi, TwitterV2IncludesHelper } = require("twitter-api-v2");

const logger = require("../../logger.js");
const { timer } = require("../index.js");
const config = require("../../config/env.js");

let twitterClient = new TwitterApi(config.TWITTER_DEV_TOKEN);
const readOnlyClient = twitterClient.readOnly;
const getTweetById = async (id) => {
  const tweet = await readOnlyClient.v2.singleTweet(id);
  console.log("tweet", tweet);
  return tweet;
};
const searchTweets = async (search, start_time, end_time) => {
  try {
    search = sanitizeTweet(search);
    console.log("searching in twitter", `"${search}" -is:retweet`);
    const jsTweets = await readOnlyClient.v2.search(`"${search}" -is:retweet`, {
      "tweet.fields": ["conversation_id", "created_at", "attachments", "id"],
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
  } catch (error) {
    logger.info(`error due to rate limiting - ${error.data.title}`);
    if (error.data.status === 429) {
      logger.info("waiting for rating limiting time");
      await timer(15 * 60 * 1000);
      return searchTweets(search, start_time, end_time);
    }
  }
};

const tweetLikedUsers = async (postId, start_time, end_time) => {
  try {
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
    // console.log("result", result);
    return result;
  } catch (error) {
    logger.info(`error due to rate limiting - ${error.data.title}`);
    if (error.data.status === 429) {
      logger.info("waiting for rating limiting time");
      await timer(15 * 60 * 1000);
      return tweetLikedUsers(postId, start_time, end_time);
    }
  }
};

const retweetedUsers = async (postId, start_time, end_time) => {
  try {
    const users = await readOnlyClient.v2.tweetRetweetedBy(postId, {
      "tweet.fields": ["text", "created_at"],
      asPaginator: true,
      max_results: 100,
    });

    const result = [];
    for await (const user of users) {
      result.push({
        username: user.username,
      });
    }
    // console.log("result", result);
    return result;
  } catch (error) {
    logger.info(`error due to rate limiting - ${error.data.title}`);
    if (error.data.status === 429) {
      logger.info("waiting for rating limiting time");
      await timer(15 * 60 * 1000);
      return retweetedUsers(postId, start_time, end_time);
    }
  }
};

const tweetRepliedUsers = async (postId, start_time, end_time) => {
  try {
    const jsTweets = await readOnlyClient.v2.search(
      `conversation_id:${postId}`,
      {
        "tweet.fields": ["conversation_id", "created_at"],
        expansions: ["author_id"],
        "user.fields": ["location", "name"],
        max_results: 100,
        start_time,
        end_time,
      }
    );

    const includes = new TwitterV2IncludesHelper(jsTweets);

    const result = [];
    for await (const tweet of jsTweets) {
      const author = includes.author(tweet);
      // console.log("result", author, tweet);
      result.push({
        username: author.username,
        createdAt: tweet.created_at,
        postId: tweet.id,
        postLink: `https://twitter.com/${author.username}/status/${tweet.id}`,
        postContent: tweet.text,
      });
    }
    // console.log("result", result);
    return result;
  } catch (error) {
    logger.info(`error due to rate limiting - ${error.data.title}`);
    if (error.data.status === 429) {
      logger.info("waiting for rating limiting time");
      await timer(15 * 60 * 1000);
      return tweetRepliedUsers(postId, start_time, end_time);
    }
  }
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

const sanitizeTweet = (tweet) =>
  tweet.replace(/\b(http|https)?(:|::)\/\/\S+/gi, "");

// const x = `Trying out link test 2`;

// const x = `Embrace the challenges that come your way, for they are the stepping stones to your growth and success. 💪📷 #EmbraceTheJourney Find joy in the simple moments, where laughter and sunshine create the most beautiful memories. 📷📷`;

// console.log(x.match(/\b(http|https)?(:|::)\/\/\S+/gi));
// searchTweets(x);
// tweetLikedUsers("1624067874276126721");
// console.log(x);
// retweetedUsers("1626089401788022784");
// tweetRepliedUsers("1626089401788022784");
// followingUsers("1452687837808107520");

// getTweetById("1696232980862353566");
module.exports = {
  searchTweets,
  tweetLikedUsers,
  retweetedUsers,
  tweetRepliedUsers,
  getTwitterActionFunc,
  followingUsers,
  getTweetById,
};
