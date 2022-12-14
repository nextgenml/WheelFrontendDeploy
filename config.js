const prodConfig = {
  MIN_WALLETS_COUNT: 6,
  FETCH_HOURS: [3, 9, 15, 21],
  FETCH_MINUTE: 0,
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
};

const testConfig = {
  MIN_WALLETS_COUNT: 3,
  FETCH_HOURS: [2, 5, 17, 20],
  FETCH_MINUTE: 10,
  SECRET_KEY: "%S93A-JB@g1Bg12P#SnA.=cmL)vH&",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  CONTRACT_ADDRESS: "0x60F2CE0a06E1974a1378322B948567673f6eBF89",
  WEB3_PROVIDER_URL:
    "https://eth-goerli.g.alchemy.com/v2/surwT5Ql_QhEc083ru_C98XrwbDj-jVx",
  DEPLOYER_WALLET:
    "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  DISABLE_LOGS: false,
};

module.exports =
  process.env.NODE_ENV === "production" ? prodConfig : testConfig;
