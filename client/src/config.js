const prodConfig = {
  AIR_DROP_ADDRESS: "0xdfc94eA55D979135925257463ACEeC958C1d5b82",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  ABC_TOKEN: "0xEE0d7199dF48a603b504fBD76AE85ff4e9F283b1",
  RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  WALLET_ADDRESS: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  CHAT_BOT_URL: "PROD_URL",
};

const testConfig = {
  AIR_DROP_ADDRESS: "0x3097e4ae7190633959a6f106AcAa465B56748396",
  REWARD_TOKEN: "0x4bB4954FC47ce04B62F3493040ff8318E4A72981",
  ABC_TOKEN: "0xEE0d7199dF48a603b504fBD76AE85ff4e9F283b1",
  RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  WALLET_ADDRESS: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  CHAT_BOT_URL: "http://localhost:3000",
};

export default process.env.REACT_APP_NODE_ENV === "production"
  ? prodConfig
  : testConfig;