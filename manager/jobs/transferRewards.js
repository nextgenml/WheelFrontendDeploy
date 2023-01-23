const { unPaidChores, markChoresAsPaid } = require("../../repository/chores");
const { processPrizes } = require("../rewardTransfer");

const transferRewards = async () => {
  const chores = await unPaidChores();

  const data = chores.map((c) => ({
    walletId: c.wallet_id,
    prize: c.value,
    id: c.wallet_id,
  }));
  await processPrizes(data, async (id) => {
    const choreIds = chores.filter((c) => c.wallet_id === id)[0].ids.split(",");
    await markChoresAsPaid(choreIds);
  });
};

transferRewards();
module.exports = {
  transferRewards,
};
