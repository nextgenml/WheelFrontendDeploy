const { unPaidChores, markChoresAsPaid } = require("../../repository/chores");
const { processPrizesV1 } = require("../rewardTransferV1");

const transferRewards = async () => {
  const chores = await unPaidChores();

  const data = chores.map((c) => ({
    walletId: c.wallet_id,
    prize: c.value,
    id: c.wallet_id,
  }));
  await processPrizesV1(data, "eeth", async (id) => {
    const choreIds = chores.filter((c) => c.wallet_id === id)[0].ids.split(",");
    await markChoresAsPaid(choreIds);
  });
};

// transferRewards();
module.exports = {
  transferRewards,
};
