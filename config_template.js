const prodConfig = {
  // https://randomkeygen.com/
  // this key is used for authentication in end points
  SECRET_KEY: "",
  // USDT ADDRESS
  REWARD_TOKEN: "",
  // REFLECTION TOKEN ADDRESS
  CONTRACT_ADDRESS: "",
  // TEST NET
  WEB3_PROVIDER_URL:
    "",
  // REWARD WALLET ADMIN KEY - USDT
  DEPLOYER_WALLET:
    "",
  RPC_URL: "",
  DISABLE_LOGS: false, // bool
  DB_HOST: "",
  TWITTER_DEV_TOKEN: "",
  // user for authenticating admin user
  ADMIN_WALLET: "",
};

const testConfig = {
  SECRET_KEY: "",
  REWARD_TOKEN: "",
  CONTRACT_ADDRESS: "",
  WEB3_PROVIDER_URL:
    "",
  DEPLOYER_WALLET:
    "",
  RPC_URL: "",
  DISABLE_LOGS: false,
  DB_HOST: "",
  TWITTER_DEV_TOKEN:
    "",
  ADMIN_WALLET: "",

};

const commonConfig = {
  MIN_WALLETS_COUNT: 6,
  FETCH_HOURS: [3, 9, 15, 21],
  FETCH_MINUTE: 0,
  MINIMUM_WALLET_BALANCE: 100,

  // chores
  NO_OF_POSTS_PER_DAY: 650,
  COST_PER_CHORE: 0.007,
  POST_CHORE_VALID_DAYS: 1,
  OTHER_CHORE_VALID_DAYS: 3,

  // scheduling the chores algorithm
  CREATE_POST_CHORES_AT: [1, 23],

  // Mininum earning from chores for a payout
  MIN_AMOUNT_TO_PAY_IN_GO: 50,
  SUCCESS_FACTOR: {
    BEST: {
      POST: 10000,
      LIKE: 25000,
      COMMENT: 10000,
      RETWEET: 10000,
    },
    BETTER: {
      POST: 5000,
      LIKE: 12500,
      COMMENT: 5000,
      RETWEET: 5000,
    },
    GOOD: {
      POST: 100,
      LIKE: 2500,
      COMMENT: 1000,
      RETWEET: 1000,
    },
  },
  // above and beyond
  SUCCESS_FACTOR_UPPER_BOUND_PERCENTAGE: 10,
};

module.exports =
  process.env.NODE_ENV === "production"
    ? { ...prodConfig, ...commonConfig }
    : { ...testConfig, ...commonConfig };
