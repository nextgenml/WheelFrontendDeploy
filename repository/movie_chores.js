const { runQueryAsync } = require("../utils/spinwheelUtil");

const getAll = async (walletId) => {
  const query = `select * from movie_chores where wallet_id = ? and closed_by_movie_id is null order by created_at asc;`;
  return await runQueryAsync(query, [walletId]);
};

const create = async (postLink, walletId) => {
  const query = `insert into movie_chores(twitter_link, wallet_id, created_at) values(?, ? , now())`;
  return await runQueryAsync(query, [postLink, walletId]);
};

const update = async (postLink, walletId, id) => {
  const query = `update movie_chores set twitter_link = ? where id = ? and wallet_id = ?`;
  return await runQueryAsync(query, [postLink, id, walletId]);
};

const isLinkExists = async (link, id) => {
  const query = `select 1 from movie_chores where twitter_link = ? and id != ?`;
  const results = await runQueryAsync(query, [link, parseInt(id)]);
  return results.length > 0;
};

const markChoresAsCompleted = async (walletId, movieId) => {
  const query = `update movie_chores set closed_by_movie_id = ? where wallet_id = ? and closed_by_movie_id is null`;
  const results = await runQueryAsync(query, [movieId, walletId]);
  return results[0];
};

const choresCompleted = async (walletId) => {
  const query = `select count(1) as count from movie_chores where wallet_id = ?`;
  const results = await runQueryAsync(query, [walletId]);
  return results[0].count;
};
module.exports = {
  choresCompleted,
  getAll,
  create,
  update,
  isLinkExists,
  markChoresAsCompleted,
};
