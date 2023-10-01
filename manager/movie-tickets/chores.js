const {
  isLinkExists,
  markChoresAsCompleted,
  choresCompleted,
} = require("../../repository/movie_chores");
const { markReferralAsDone } = require("../../repository/movie_referrals");
const {
  getMovieById,
  markMovieAsCompleted,
} = require("../../repository/user_movies");
const { getTweetById } = require("../../utils/mediaClients/twitter");

const isValidLink = async (link, choreId) => {
  if (link && (link.includes("twitter.com") || link.includes("x.com"))) {
  } else return [false, "Invalid link submitted"];

  const isExists = await isLinkExists(link, choreId);

  if (isExists) return [false, "Post link already exists"];
  const split = link.split("/");
  const id_temp = split[split.length - 1];
  const id = id_temp.split("?")[0];

  if (parseInt(id) > 0) {
    try {
      const tweet = await getTweetById(id);
      try {
        if (tweet && tweet.errors && tweet.errors.length)
          return [false, tweet.errors[0].detail];

        const { text } = tweet.data;
        if (
          text
            .toLowerCase()
            .includes(
              process.env.REACT_APP_MOVIE_TICKETS_TAG_LINE.toLowerCase()
            )
        )
          return [true, "Validated"];
        else return [false, "Tweet does not contain mandatory text provided"];
      } catch (error) {
        return [
          false,
          "Unable to validate. Please try again after 15 minutes",
          error,
        ];
      }
    } catch (error) {}
  } else {
    return [false, "Invalid link posted"];
  }
};

const choresCleanup = async (movieId, walletId) => {
  const movie = await getMovieById(movieId, walletId);

  let valid = false;
  if (
    movie.ticket_image_path &&
    movie.hall_image_path &&
    movie.posture_image_path
  )
    valid = true;

  if (valid) {
    await markMovieAsCompleted(walletId, movieId);
    await markChoresAsCompleted(walletId, movieId);
  }
  return valid;
};
const markReferral = async (walletId) => {
  const choresDone = await choresCompleted(walletId);
  if (choresDone >= process.env.MOVIE_TICKETS_REFERRAL_SUCCESS_CHORES_COUNT)
    await markReferralAsDone(walletId);
};
module.exports = {
  isValidLink,
  choresCleanup,
  markReferral,
};
