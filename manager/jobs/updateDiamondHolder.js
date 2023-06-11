const holderRepo = require("../../repository/holder");
const { isSellingExists } = require("../../repository/token_transactions");
const { runQueryAsync } = require("../../utils/spinwheelUtil");

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

const tempScript = async () => {
  // const create = `
  //     CREATE TEMPORARY TABLE temp_holders AS (
  //       SELECT id
  //       FROM holders
  //       WHERE nml_balance > 0
  //           OR ape_balance > 0
  //           OR volt_balance > 0
  //           OR floki_balance > 0
  //           OR twitter_link IS NOT NULL
  //           OR facebook_link IS NOT NULL
  //           OR medium_link IS NOT NULL
  //           OR telegram_link IS NOT NULL
  //           OR invite_code IS NOT NULL
  //           OR social_links_updated_at IS NOT NULL
  //           OR minimum_balance_for_ai IS NOT NULL
  //           OR elon_balance > 0
  //   );`;

  // await runQueryAsync(create, []);
  // const anotherCreate = `
  //   CREATE TEMPORARY TABLE temp_holders_1 AS (
  //     SELECT id
  //     FROM holders
  //     WHERE id NOT IN (SELECT id FROM temp_holders));
  // `;
  // await runQueryAsync(anotherCreate, []);
  const results = await runQueryAsync(`select id from temp_holders_1`, []);
  const deleteIds = results.map((x) => x.id);
  console.log("deleteIds", deleteIds.length);
  let min = 0,
    max = deleteIds.length + 1,
    size = 10000;

  while (min < max) {
    const currIds = deleteIds.splice(min, min + size);
    if (currIds.length === 0) break;
    await runQueryAsync(`delete from holders where id in (?)`, [currIds]);
    console.log(`completed for a range`, min, min + size);
    min = min + size;
  }
  // await runQueryAsync(`DROP TEMPORARY TABLE temp_holders;`, []);
  // await runQueryAsync(`DROP TEMPORARY TABLE temp_holders_1;`, []);
  console.log("process completed");
};

// tempScript();
module.exports = {
  updateDiamondHolders,
};
