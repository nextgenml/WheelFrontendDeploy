//const prodConfig = {
//  AIR_DROP_ADDRESS: "0xdfc94eA55D979135925257463ACEeC958C1d5b82",
//  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
//  ABC_TOKEN: "0xEE0d7199dF48a603b504fBD76AE85ff4e9F283b1",
//  RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
//  WALLET_ADDRESS: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
//  CHAT_BOT_URL: "https://backend.chatbot.nexgenml.com",
//  ADMIN_WALLET: "0x4b8760C3E41a9CCC9d283586dF00e4e25FC6cCe5",
//};

const prodConfig = {
  AIR_DROP_ADDRESS: "0x3097e4ae7190633959a6f106AcAa465B56748396",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  ABC_TOKEN: "0x06C28f861Fc4b31b5D2C8CAD880468aEec266F31",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  WALLET_ADDRESS: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  CHAT_BOT_URL: "https://backend.chatbot.nexgenml.com",
  API_ENDPOINT: "https://test.nexgenml.com",
  ADMIN_WALLET: "0x0030B1331Dce886e332Ac1f3ed17d3018C542114",
};
const testConfig = {
  AIR_DROP_ADDRESS: "0x3097e4ae7190633959a6f106AcAa465B56748396",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  ABC_TOKEN: "0x06C28f861Fc4b31b5D2C8CAD880468aEec266F31",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  WALLET_ADDRESS: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  CHAT_BOT_URL: "https://chatbot.nexgenml.com",
  ADMIN_WALLET_1: "0x0030B1331Dce886e332Ac1f3ed17d3018C542114",
  PAID_AMOUNT: 10,
  API_ENDPOINT: "http://localhost:8000",
  ADMIN_WALLET: "0x4b8760C3E41a9CCC9d283586dF00e4e25FC6cCe5",
};

const commonConfig = {
  MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN: 100,
};

export default process.env.NODE_ENV === "production"
  ? { ...prodConfig, ...commonConfig }
  : { ...testConfig, ...commonConfig };
