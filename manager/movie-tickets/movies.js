const moment = require("moment");
const {
  updateImage,
  getLastMovie,
  otherMovieTickets,
  getMovieById,
  rejectMovie,
  getMovieByIdV2,
  markMovieAsPaid,
  paidMovieTicketsCount,
} = require("../../repository/user_movies");
const { chatGptResponse } = require("../../utils/chatgpt");
const looksSame = require("looks-same");
const { getById } = require("../../repository/holder");
const { processPrizesV1 } = require("../rewardTransferV1");
const validateMovie = (movie, body, parsedMovieData, parsedHallData) => {
  const { ticket_image_date, hall_image_date, posture_image_date } = body;

  const errors = {};
  const movieStart = moment(movie.movie_time).subtract(1, "hour");
  const movieEnd = moment(movie.movie_time).add(4, "hour");

  errors.hall_image_issues = [];

  // if (hall_image_date) {
  //   if (!moment(hall_image_date).isBetween(movieStart, movieEnd)) {
  //     errors.hall_image_issues.push(
  //       "Hall Image is not taken during movie hours"
  //     );
  //   }
  //   if (moment().isAfter(movieEnd))
  //     errors.hall_image_issues.push(
  //       "Images cannot be uploaded after movie hours"
  //     );
  // }
  if (parsedHallData) {
    const hallName = (
      parsedMovieData?.cinemahall ||
      movie.c_hall_name ||
      ""
    ).replace(/\n/g, " ");
    const keywords = hallName.toLowerCase().split(" ");
    const parsed = parsedHallData.toLowerCase();
    console.log("keywords", keywords, parsed);

    let matched = false;
    keywords.forEach((k) => {
      if (parsed.includes(k)) matched = true;
    });
    if (!matched) {
      errors.hall_image_issues.push(
        "Hall name is not matching with the one in the ticket uploaded"
      );
    }
  }
  if (errors.hall_image_issues.length == 0) delete errors.hall_image_issues;

  // if (posture_image_date) {
  //   if (!moment(posture_image_date).isBetween(movieStart, movieEnd)) {
  //     errors.posture_image_date =
  //       "Posture Image is not taken during movie hours";
  //   }
  //   if (moment().isAfter(movieEnd))
  //     errors.posture_image_date = "Images cannot be uploaded after movie hours";
  // }

  errors.ticket_issues = [];
  // if (ticket_image_date) {
  //   if (!moment(ticket_image_date).isBefore(movieEnd)) {
  //     errors.ticket_issues.push("Ticket Image is not taken before movie hours");
  //   }
  //   if (moment().isAfter(movieEnd))
  //     errors.ticket_issues.push("Images cannot be uploaded after movie hours");
  // }
  if (parsedMovieData) {
    if (!parsedMovieData.moviename)
      errors.ticket_issues.push("Unable to capture movie name from ticket");

    if (!parsedMovieData.cinemahall)
      errors.ticket_issues.push(
        "Unable to capture movie hall name from ticket"
      );
    if (!parsedMovieData.seatnumber)
      errors.ticket_issues.push("Unable to capture seat number from ticket");
    if (!parsedMovieData.country)
      errors.ticket_issues.push("Unable to capture country from ticket");
    if (!parsedMovieData.avg_movie_price)
      errors.ticket_issues.push("Unable to estimate movie price");
  }
  if (errors.ticket_issues.length == 0) delete errors.ticket_issues;
  return errors;
};

const updateImages = async (movieId, body, files) => {
  const { ticket_image_date, hall_image_date, posture_image_date } = body;

  if (ticket_image_date) {
    const ticket = files.find((x) => x.fieldname === "ticket_image");

    if (ticket) {
      await updateImage(movieId, "ticket_image_path", ticket.path);
    }
  }

  if (hall_image_date) {
    const ticket = files.find((x) => x.fieldname === "hall_image");

    if (ticket) {
      await updateImage(movieId, "hall_image_path", ticket.path);
    }
  }

  if (posture_image_date) {
    const ticket = files.find((x) => x.fieldname === "posture_image");

    if (ticket) {
      await updateImage(movieId, "posture_image_path", ticket.path);
    }
  }
};

const enableReceiptsUpload = async (
  walletId,
  chores,
  isNmlHolder,
  isNMLHolderOnly
) => {
  let enableUpload = false;
  const lastMovie = await getLastMovie(walletId);
  console.log(
    "isNmlHolder",
    isNmlHolder,
    "lastMovie",
    lastMovie,
    isNMLHolderOnly
  );
  if (
    isNmlHolder &&
    !isNMLHolderOnly &&
    parseInt(process.env.MOVIE_TICKETS_FLOW_TYPE) !== 2
  ) {
    if (
      !lastMovie ||
      moment().diff(moment(lastMovie.movie_time), "days") >=
        process.env.MOVIE_TICKETS_NML_USER_DAYS_GAP_TO_AVAIL
    )
      enableUpload = true;
  } else {
    enableUpload =
      chores.length >= process.env.MOVIE_TICKETS_TOTAL_CHORES_FOR_NEW_USER;
  }
  return enableUpload;
};

const parseTicket = async (text) => {
  const prompt = `${process.env.MOVIE_TICKETS_PARSE_START_TEXT} 
  ${text}
  ${process.env.MOVIE_TICKETS_PARSE_END_TEXT}`;

  const messages = [
    {
      role: "system",
      content: prompt,
    },
  ];
  // console.log("final prompt", prompt);
  const { content } = await chatGptResponse(messages);

  const json = JSON.parse(content);
  console.log("json", json);

  avg = (json.avg_movie_price || "").match(/\d+/);
  json.avg_movie_price = avg ? avg[0] : null;

  return { prompt, json };
};

const checkDuplicateTickets = async (movieId) => {
  const otherTickets = await otherMovieTickets(movieId);
  const currentMovie = await getMovieByIdV2(movieId);
  for (const movie of otherTickets) {
    if (movie.ticket_image_path && currentMovie.ticket_image_path) {
      const { equal } = await looksSame(
        movie.ticket_image_path,
        currentMovie.ticket_image_path
      );
      if (equal) {
        return await rejectMovie(movieId);
      }
    }
  }
  // releaseFunds(currentMovie);
};
const releaseFunds = async (currentMovie) => {
  const { wallet_id, id } = currentMovie;
  console.log("releasing funds");

  const success = async () => {
    await markMovieAsPaid(id);
  };

  const prize =
    process.env.MOVIE_TICKETS_REWARD_CURRENCY === "nml"
      ? process.env.MOVIE_TICKETS_NML_REWARD
      : (currentMovie.avg_movie_price / process.env.ETH_VALUE).toFixed(2);
  let data = [
    {
      walletId: wallet_id,
      prize,
      id,
    },
  ];
  await processPrizesV1(
    data,
    process.env.MOVIE_TICKETS_REWARD_CURRENCY,
    success
  );

  const holder = await getById(wallet_id);
  const isNmlHolder =
    holder &&
    holder.nml_balance >= parseInt(process.env.MOVIE_TICKETS_MIN_NML_BALANCE);
  if (!isNmlHolder && process.env.MOVIE_TICKETS_REWARD_CURRENCY != "nml") {
    const total = await paidMovieTicketsCount(wallet_id);
    if (total === 0) {
      data = [
        {
          walletId: wallet_id,
          prize: process.env.MOVIE_TICKETS_NML_REWARD,
          id,
        },
      ];
      await processPrizesV1(data, "nml", success);
    }
  }
};
module.exports = {
  validateMovie,
  updateImages,
  enableReceiptsUpload,
  parseTicket,
  checkDuplicateTickets,
};
