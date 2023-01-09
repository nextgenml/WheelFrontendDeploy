const {
  getTotalEarnings,
  getTodayEarnings,
  getTodayTotal,
  getTodayChoresTotal,
  getOldChoresTotal,
  getTotalByChore,
} = require("../repository/chores");

const getSocialSharingStats = async (req, res) => {
  try {
    const { mediaType, walletId } = req.query;

    const [
      total,
      today,
      todayLost,
      todayMax,
      newTotal,
      old,
      like,
      retweet,
      comment,
      follow,
    ] = await Promise.all([
      getTotalEarnings(walletId),
      getTodayEarnings(walletId),
      getTodayTotal(walletId),
      getTodayTotal(walletId),
      getTodayChoresTotal(walletId, mediaType),
      getOldChoresTotal(walletId, mediaType),
      ...["like", "retweet", "comment", "follow"].map((chore) =>
        getTotalByChore(walletId, mediaType, chore)
      ),
    ]);

    res.json({
      total,
      today,
      todayLost,
      todayMax,
      newTotal,
      old,
      like,
      retweet,
      comment,
      follow,
    });
  } catch (ex) {
    logger.error(`error occurred in getTabStats api: ${ex}`);
    res.sendStatus(500);
  }
};

module.exports = {
  getSocialSharingStats,
};
