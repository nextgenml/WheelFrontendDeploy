const userMoviesRepo = require("../../repository/user_movies");
const logger = require("../../logger");
const { getTextFromImage } = require("../../utils/ocr");
const {
  validateMovie,
  updateImages,
  parseTicket,
  checkDuplicateTickets,
} = require("../../manager/movie-tickets/movies");
const { choresCleanup } = require("../../manager/movie-tickets/chores");
const { extractTextFromImage } = require("../../utils/google_vision");
const { getGeocode, calculateDistance } = require("../../utils/google_maps");

const list = async (req, res) => {
  try {
    let { viewAs, walletId } = req.query;
    if (viewAs && walletId !== process.env.ADMIN_WALLET)
      return res.status(401).json({
        message: "Unauthorized",
      });
    walletId = viewAs || walletId;
    const data = await userMoviesRepo.list(walletId);

    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error in user movies chores - get: ${error}`);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
const get = async (req, res) => {
  try {
    let { viewAs, walletId } = req.query;
    if (viewAs && walletId !== process.env.ADMIN_WALLET)
      return res.status(401).json({
        message: "Unauthorized",
      });
    walletId = viewAs || walletId;
    const data = await userMoviesRepo.get(walletId);

    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error in user movies chores - get: ${error}`);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    await userMoviesRepo.create({
      ...req.body,
      walletId: req.query.walletId,
    });
    res.json({
      message: "success",
    });
  } catch (error) {
    logger.error(`error in user movies chores - create: ${error}`);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { body, files, query, params } = req;
    const { movieId } = params;

    console.log(
      `walletId: ${params.walletId}, movieId: ${movieId}, body: ${body}, files: ${files}`
    );

    await userMoviesRepo.update({
      ...req.body,
      walletId: req.query.walletId,
      id: movieId,
    });

    let parsedMovieData = null,
      parsedHallData = null,
      chatPrompt = null;
    if (files) {
      const ticketImage = files.find((x) => x.fieldname === "ticket_image");
      if (ticketImage) {
        const text = await extractTextFromImage(ticketImage.path);
        let { prompt, json } = await parseTicket(text);
        parsedMovieData = json;
        chatPrompt = prompt;
      }
      const hallImage = files.find((x) => x.fieldname === "hall_image");
      if (hallImage) {
        parsedHallData = await extractTextFromImage(hallImage.path);
        console.log("parsedHallData", parsedHallData);
        parsedHallData = parsedHallData || "x<->x";
      }
    }

    const movie = await userMoviesRepo.getMovieById(movieId, query.walletId);
    const errors = {}; // validateMovie(movie, body, parsedMovieData, parsedHallData);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        errors,
        parsedMovieData,
        parsedHallData,
        chatPrompt,
      });
    }

    await updateImages(movieId, body, files);
    await userMoviesRepo.updateMovieInfo(
      movieId,
      parsedMovieData,
      query.walletId
    );
    const isComplete = await choresCleanup(movieId, query.walletId);
    if (isComplete) checkDuplicateTickets(movieId);
    res.json({
      message: "success",
      isComplete,
      parsedMovieData,
      parsedHallData,
      chatPrompt,
    });
  } catch (error) {
    logger.error(`error in user movies update - create: ${error}`);
    console.log("err.stack;", error.stack);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const canUploadTickets = async (req, res) => {
  try {
    const { lat, long, walletId } = req.query;
    const { id } = req.params;

    const movie = await userMoviesRepo.getMovieById(id, walletId);

    const location = `${movie.c_hall_name} ${movie.c_city} ${movie.c_state} ${movie.c_country}`;
    const geoCodes = await getGeocode(location);

    const distance = calculateDistance(
      lat,
      long,
      geoCodes.latitude,
      geoCodes.longitude
    );
    console.log("distance", distance);
    const canUpload = distance <= 2;
    res.json({
      canUpload,
      message: canUpload
        ? ""
        : "You are not at the cinema theatre. Please upload images once you reach the cinema theatre",
    });
  } catch (error) {
    logger.error(`error in user canUploadTickets - create: ${error}`);
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  get,
  create,
  update,
  list,
  canUploadTickets,
};
