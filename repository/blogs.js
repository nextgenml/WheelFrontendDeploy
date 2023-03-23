const { runQueryAsync } = require("../utils/spinwheelUtil");
const { v4: uuidv4 } = require("uuid");

const firstBlogAt = async (walletId) => {
  const query =
    "select create_date from saved_prompts where wallet_address = ? order by create_date asc limit 1";
  return await runQueryAsync(query, [walletId]);
};
const getBlogStats = async (blogId) => {
  const query =
    "select link, create_date from saved_prompts where promoted_blog_id = ? order by create_date desc";
  return await runQueryAsync(query, [blogId]);
};

const getCustomBlogs = async (walletId, isAdmin, search, pageSize, offset) => {
  const query =
    "select * from saved_prompts where (1 = ? or wallet_address = ?) and (1 = ? or wallet_address = ?) and initiative = ? order by create_date desc limit ? offset ?";

  const data = await runQueryAsync(query, [
    isAdmin ? 1 : 0,
    walletId,
    search ? 0 : 1,
    search,
    "blog-customization",
    pageSize,
    offset,
  ]);

  const countQuery =
    "select count(1) as count from saved_prompts where (1 = ? or wallet_address = ?) and (1 = ? or wallet_address = ?) and initiative = ?";
  const data1 = await runQueryAsync(countQuery, [
    isAdmin ? 1 : 0,
    walletId,
    search ? 0 : 1,
    search,
    "blog-customization",
  ]);

  return [data1[0].count, data];
};

const getPromotedBlogs = async (promotedWallets, walletId) => {
  if (!promotedWallets.length) return [[], 0];
  const query2 =
    "select promoted_blog_id from saved_prompts where wallet_address = ?";
  const data2 = await runQueryAsync(query2, [walletId]);
  const promotedIds = [...data2.map((x) => x.promoted_blog_id), -1];
  console.log("promotedIds", promotedIds);

  const query =
    "select * from saved_prompts where wallet_address in (?) and initiative = ? and promoted = 1 and id not in (?) limit 10";
  const data = await runQueryAsync(query, [
    promotedWallets,
    "blog-customization",
    promotedIds,
  ]);
  const query1 =
    "select count(1) as count from saved_prompts where wallet_address in (?) and initiative = ? and promoted = 1 and id not in (?)";
  const data1 = await runQueryAsync(query1, [
    promotedWallets,
    "blog-customization",
    promotedIds,
  ]);
  return [data, data1[0].count];
};

const updateBlogData = async (data) => {
  if (data.blog) {
    await runQueryAsync(
      `UPDATE saved_prompts SET validated_flag = ?, paid_flag = ?, blog = ? WHERE transactionID = ?`,
      // [data.validatedFlag, data.paidFlag, data.promoted, data.blog, data.transactionID]
      [data.validatedFlag, data.paidFlag, data.blog, data.transactionID]
    );
  } else
    await runQueryAsync(
      `UPDATE saved_prompts SET validated_flag = ?, paid_flag = ? WHERE transactionID = ?`,
      // [data.validatedFlag, data.paidFlag, data.promoted, data.transactionID]
      [data.validatedFlag, data.paidFlag, data.transactionID]
    );
};

const saveBlogData = async (data, image_urls) => {
  const query = `INSERT INTO saved_prompts(transactionID, wallet_address, initiative, prompt, blog, mediumUrl, twitterUrl, facebookUrl, linkedinUrl, instagramUrl, pinterestUrl, hashword, keyword, image_urls, create_date, validated_flag, paid_amount, paid_flag, promoted_wallet, promoted_blog_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const transactionId = uuidv4();
  const create_date = new Date().toISOString().slice(0, 19).replace("T", " ");

  return await runQueryAsync(query, [
    transactionId,
    data.wallet_address,
    data.initiative,
    data.prompt,
    data.blog,
    data.mediumurl,
    data.twitterurl,
    data.facebookurl,
    data.linkedinurl,
    data.instagramurl,
    data.pinteresturl,
    data.hashword,
    data.keyword,
    image_urls,
    create_date,
    parseInt(data.validated_flag) || 0,
    parseInt(data.paid_amount) || 0,
    parseInt(data.paid_flag) || 0,
    data.promotedWallet,
    parseInt(data.promotedId) || 0,
  ]);
};

const totalBlogs = async () => {
  const query = `select count(1) as count from saved_prompts`;
  const count = await runQueryAsync(query);
  return [count[0].count];
};

const selectSearchElements = async (searchWalletAdd) => {
  const query = `SELECT * from saved_prompts WHERE wallet_address='${searchWalletAdd}' ORDER BY create_date DESC, wallet_address DESC`;
  const data = await runQueryAsync(query);
  return [data];
};

const selectAllElements = async (pageSize, offset) => {
  const query = `SELECT * from saved_prompts ORDER BY create_date DESC, wallet_address DESC LIMIT ${pageSize} OFFSET ${offset}`;
  const data = await runQueryAsync(query);
  return [data];
};

const checkReplica = async (wallet_address, prompt) => {
  const query = `select 1 from saved_prompts where wallet_address = ? and prompt = ?`;
  const result = await runQueryAsync(query, [wallet_address, prompt]);
  return result;
};

const totalBloggers = async () => {
  const query = `select count(distinct wallet_address) as count from saved_prompts`;
  const result = await runQueryAsync(query, []);
  return result[0].count;
};

const uniqueBloggersSince = async (date) => {
  const query = `select distinct wallet_address from saved_prompts where created_date > ?`;
  const result = await runQueryAsync(query, [date]);
  return result[0].count;
};

const blogsSince = async (walletId, date) => {
  const query = `select * from saved_prompts where walletId = ? and created_date > ?`;
  const result = await runQueryAsync(query, [walletId, date]);
  return result;
};

module.exports = {
  blogsSince,
  uniqueBloggersSince,
  saveBlogData,
  totalBlogs,
  selectSearchElements,
  selectAllElements,
  getCustomBlogs,
  getPromotedBlogs,
  getBlogStats,
  firstBlogAt,
  updateBlogData,
  checkReplica,
  totalBloggers,
};
