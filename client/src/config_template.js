const prodConfig = {
  AIR_DROP_ADDRESS: "",
  REWARD_TOKEN: "",
  ABC_TOKEN: "",
  RPC_URL: "",
  WALLET_ADDRESS: "",
  CHAT_BOT_URL: "",
  API_ENDPOINT: "",
  ADMIN_WALLET: "",
  ADMIN_WALLET_1: "",
  PROMOTIONS_RECEIVER_WALLET: "",
};
const testConfig = {
  AIR_DROP_ADDRESS: "",
  REWARD_TOKEN: "",
  ABC_TOKEN: "",
  RPC_URL: "",
  WALLET_ADDRESS: "",
  CHAT_BOT_URL: "",
  API_ENDPOINT: "",
  ADMIN_WALLET: "",
  ADMIN_WALLET_1: "",
  PROMOTIONS_RECEIVER_WALLET: "",
};

const commonConfig = {
  MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN: 100,
};

export default process.env.NODE_ENV === "production"
  ? { ...prodConfig, ...commonConfig }
  : { ...testConfig, ...commonConfig };
