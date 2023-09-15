const movieChoresRepo = require("../../repository/movie_chores");
const logger = require("../../logger");
const {
  isValidLink,
  markReferral,
} = require("../../manager/movie-tickets/chores");
const moment = require("moment");
const { getById } = require("../../repository/holder");
const { getLastMovie } = require("../../repository/user_movies");
const { enableReceiptsUpload } = require("../../manager/movie-tickets/movies");
const get = async (req, res) => {
  try {
    let { viewAs, walletId } = req.query;
    if (viewAs && walletId !== process.env.ADMIN_WALLET)
      return res.status(401).json({
        message: "Unauthorized",
      });
    walletId = viewAs || walletId;
    const data = await movieChoresRepo.getAll(walletId);
    const todayPosted = !!data.find(
      (x) => moment().diff(x.created_at, "days") === 0
    );

    const holder = await getById(walletId);

    if (holder && holder.is_banned === 1)
      return res.json({
        is_blocked: true,
      });
    const isNmlHolder =
      holder &&
      holder.nml_balance >= parseInt(process.env.MOVIE_TICKETS_MIN_NML_BALANCE);

    const enableUpload = await enableReceiptsUpload(
      walletId,
      data,
      isNmlHolder
    );

    const isMandatory =
      parseInt(process.env.MOVIE_TICKETS_CHORES_MANDATORY_FOR_NML) === 1;
    let enableChores =
      isMandatory ||
      (!isNmlHolder &&
        parseInt(process.env.MOVIE_TICKETS_ENABLE_CHORE_SECTION) === 1);

    res.json({
      data,
      total: process.env.MOVIE_TICKETS_TOTAL_CHORES_FOR_NEW_USER,
      completed: data.length,
      takeNewPost: !todayPosted,
      choreReward: process.env.MOVIE_TICKETS_CHORE_REWARD,
      enableChores,
      enableUpload,
    });
  } catch (error) {
    logger.error(`error in movie ticket chores - get: ${error}`);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const [isValid, message, error] = await isValidLink(
      req.body.twitter_link,
      -1
    );

    if (!isValid)
      return res.status(400).json({
        message,
        error,
      });
    await movieChoresRepo.create(req.body.twitter_link, req.query.walletId);
    markReferral(req.query.walletId);
    res.json({
      message: "success",
    });
  } catch (error) {
    logger.error(`error in movie ticket chores - create: ${error}`);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const [isValid, message, error] = await isValidLink(
      req.body.twitter_link,
      req.params.id
    );

    if (!isValid)
      return res.status(400).json({
        message,
        error,
      });

    await movieChoresRepo.update(
      req.body.twitter_link,
      req.query.walletId,
      req.params.id
    );
    markReferral(req.query.walletId);
    res.json({
      message: "success",
    });
  } catch (error) {
    logger.error(`error in movie ticket update - create: ${error}`);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports = {
  get,
  create,
  update,
};