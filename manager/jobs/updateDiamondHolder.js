const holderRepo = require("../../repository/holder");
const { isSellingExists } = require("../../repository/token_transactions");

const updateDiamondHolders = async () => {
  const holders = await holderRepo.getNMLHolders();
  for (const holder of holders) {
    const exists = await isSellingExists(holder.wallet_id);
    await holderRepo.updateHolderDiamondStatus(
      holder.wallet_id,
      exists ? 0 : 1
    );
    await holderRepo.updateNMLHolderDiamondStatus(
      holder.wallet_id,
      exists ? 0 : 1
    );
  }
};

module.exports = {
  updateDiamondHolders,
};
