const prodConfig = {
  // https://randomkeygen.com/
  // this key is used for authentication in end points
  SECRET_KEY: "%S93A-JB@g1Bg12P#SnA.=cmL)vH&O",
  // USDT ADDRESS
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  // REFLECTION TOKEN ADDRESS
  CONTRACT_ADDRESS: "0x60F2CE0a06E1974a1378322B948567673f6eBF89",
  // TEST NET
  WEB3_PROVIDER_URL:
    "https://eth-goerli.g.alchemy.com/v2/surwT5Ql_QhEc083ru_C98XrwbDj-jVx",
  // REWARD WALLET ADMIN KEY - USDT
  DEPLOYER_WALLET:
    "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  DISABLE_LOGS: true,
  DB_HOST: "prod-mysql",
  TWITTER_DEV_TOKEN: "",
  // user for authenticating admin user
  ADMIN_WALLET: "0x49733c8bCd1830ED5300c8d1d0E8432ddE5ed601",
  ADMIN_WALLET_1: "0x238c26EFd65F6c7023650c59062ceF71F57c0ec8",
  MAX_SUPPLY: 1000000000000,
};

const testConfig = {
  SECRET_KEY: "%S93A-JB@g1Bg12P#SnA.=cmL)vH&",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  CONTRACT_ADDRESS: "0x06C28f861Fc4b31b5D2C8CAD880468aEec266F31", // TO DO: CHANGE WALLET ADDRESS HERE
  WEB3_PROVIDER_URL:
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  DEPLOYER_WALLET:
    "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  DISABLE_LOGS: false,
  DB_HOST: "127.0.0.1",
  TWITTER_DEV_TOKEN:
    "AAAAAAAAAAAAAAAAAAAAAA1ukwEAAAAAlSl4X%2FTjbuuLXmNS8kJNO8MgGz4%3D9uhtUccA0oQNe9rkz9wPhxZ0472SeJhZ5p19YIIXyWtGnoJ6yV",
  ADMIN_WALLET: "0x49733c8bCd1830ED5300c8d1d0E8432ddE5ed601",
  ADMIN_WALLET_1: "0xfeC714277eCcd686bDBd9A49e2877bAc2C532168",
  MAX_SUPPLY: 1000000000000,
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

  TOKEN_MONTHLY_ALLOCATION: [
    0.01, 0.02, 0.25, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12,
  ],
};

module.exports =
  process.env.NODE_ENV === "production"
    ? { ...prodConfig, ...commonConfig }
    : { ...testConfig, ...commonConfig };
