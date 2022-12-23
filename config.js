const prodConfig = {
  MIN_WALLETS_COUNT: 6,
  FETCH_HOURS: [0, 2, 15, 20],
  FETCH_MINUTE: 20,
  SECRET_KEY: "%S93A-JB@g1Bg12P#SnA.=cmL)vH&O",
  ADMIN_KEY: "4349749f97226605564c20fa6b9f35f259456a710ce23ca01bffe239cab3ae5f",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  CONTRACT_ADDRESS: "0x60F2CE0a06E1974a1378322B948567673f6eBF89",
  WEB3_PROVIDER_URL:
    "https://eth-goerli.g.alchemy.com/v2/surwT5Ql_QhEc083ru_C98XrwbDj-jVx",
  DEPLOYER_WALLET:
    "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
};

const testConfig = {
  MIN_WALLETS_COUNT: 6,
  FETCH_HOURS: [1, 2, 15, 20],
  FETCH_MINUTE: 38,
  SECRET_KEY: "%S93A-JB@g1Bg12P#SnA.=cmL)vH&",
  ADMIN_KEY: "4349749f97226605564c20fa6b9f35f259456a710ce23ca01bffe239cab3ae5f",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  CONTRACT_ADDRESS: "0x60F2CE0a06E1974a1378322B948567673f6eBF89",
  WEB3_PROVIDER_URL:
    "https://eth-goerli.g.alchemy.com/v2/surwT5Ql_QhEc083ru_C98XrwbDj-jVx",
  DEPLOYER_WALLET:
    "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
};

module.exports =
  process.env.NODE_ENV === "production" ? prodConfig : testConfig;
