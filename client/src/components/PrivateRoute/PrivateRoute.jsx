import { Typography } from "@mui/material";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import config from "../../config";

const PrivateRoute = ({ component }) => {
  const { isConnected, address } = useAccount();

  async function signNonce(nonce) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(nonce);
    const add = await signer.getAddress();
    console.log("signature", signature, add);
    return { address: add, signature };
  }

  async function login() {
    try {
      const { nonce } = {
        nonce:
          "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      }; //await fetch('/auth/nonce').then(res => res.json());
      const { address, signature } = await signNonce(nonce);
      const res = await fetch(`${config.API_ENDPOINT}/api/v1/holders/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });
      const { token } = await res.json();
      // Store the token in a secure cookie or localStorage
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    // login();
  }, []);
  if (isConnected) return <>{component}</>;
  else
    return (
      <Typography variant="h6" sx={{ mb: 20 }}>
        Please connect your wallet
      </Typography>
    );
};
export default PrivateRoute;
