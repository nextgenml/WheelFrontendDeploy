const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const get = async (walletId) => {
  const query = `select * from user_movies where workflow_state = 'active' and wallet_id = ? order by created_at desc limit 1;`;
  const results = await runQueryAsync(query, [walletId]);
  return results[0];
};

const list = async (walletId) => {
  const query = `select * from user_movies where wallet_id = ? order by created_at desc;`;
  return await runQueryAsync(query, [walletId]);
};

const create = async (data) => {
  const query = `insert into user_movies(movie_name, movie_time, wallet_id, created_at) values(?, ?, ?, now())`;
  return await runQueryAsync(query, [
    data.movieName,
    moment(data.movieTime).format(DATE_TIME_FORMAT),
    data.walletId,
  ]);
};

const update = async (data) => {
  const query = `update user_movies set movie_name = ?, movie_time = ? where wallet_id = ? and id = ?`;
  return await runQueryAsync(query, [
    data.movieName,
    moment(data.movieTime).format(DATE_TIME_FORMAT),
    data.walletId,
    data.id,
  ]);
};

const getMovieById = async (movieId, walletId) => {
  const query = `select * from user_movies where workflow_state = 'active' and wallet_id = ? and id = ? order by created_at desc limit 1;`;
  const results = await runQueryAsync(query, [walletId, movieId]);
  return results[0];
};
const getMovieByIdV2 = async (movieId) => {
  const query = `select * from user_movies where id = ?`;
  const results = await runQueryAsync(query, [movieId]);
  return results[0];
};

const updateImage = async (movieId, imageCol, imagePath) => {
  const query = `update user_movies set ${imageCol} = ? where id = ?`;
  return await runQueryAsync(query, [imagePath, movieId]);
};

const getLastMovie = async (walletId) => {
  const query = `select * from user_movies where workflow_state = 'paid' and wallet_id = ? order by created_at desc limit 1;`;
  const results = await runQueryAsync(query, [walletId]);
  return results[0];
};

const markMovieAsCompleted = async (walletId, id) => {
  const query = `update user_movies set workflow_state = 'completed' where wallet_id = ? and id = ?`;
  return await runQueryAsync(query, [walletId, id]);
};
const updateMovieInfo = async (movieId, movieData, walletId) => {
  if (!movieData) return;
  const query = `update user_movies set c_hall_name = ?, c_seat_number = ?, c_city = ?, c_state = ?, c_country = ?, c_utc_time = ?, c_others = ?, avg_movie_price = ?, c_movie_name = ?, c_movie_date = ?, c_movie_time = ?   where wallet_id = ? and id = ?`;
  return await runQueryAsync(query, [
    movieData.cinemahall,
    movieData.seatnumber,
    movieData.city,
    movieData.state,
    movieData.country,
    movieData.UTCtime,
    movieData.others,
    movieData.avg_movie_price,
    movieData.moviename,
    movieData.moviedate,
    movieData.movietime,
    walletId,
    movieId,
  ]);
};

const otherMovieTickets = async (movieId) => {
  const query = `select ticket_image_path from user_movies where id != ? and workflow_state != 'rejected'`;
  return await runQueryAsync(query, [movieId]);
};
const rejectMovie = async (movieId) => {
  const query = `update user_movies set workflow_state = 'rejected' where id = ?`;
  return await runQueryAsync(query, [movieId]);
};
const markMovieAsPaid = async (movieId) => {
  const query = `update user_movies set workflow_state = 'paid' where id = ?`;
  return await runQueryAsync(query, [movieId]);
};
const paidMovieTicketsCount = async (walletId) => {
  const query = `select count(1) as count from user_movies where wallet_id = ? and workflow_state = 'paid'`;
  const results = await runQueryAsync(query, [walletId]);
  return results[0]?.count || 0;
};
module.exports = {
  paidMovieTicketsCount,
  markMovieAsPaid,
  rejectMovie,
  markMovieAsCompleted,
  get,
  create,
  update,
  getMovieById,
  updateImage,
  getLastMovie,
  updateMovieInfo,
  list,
  otherMovieTickets,
  getMovieByIdV2,
};
