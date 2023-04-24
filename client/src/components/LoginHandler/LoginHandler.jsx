/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { fetchHolderNonceAPI, loginHolderAPI } from "../../API/Holder";
const LoginHandler = () => {
  const { isConnected, address } = useAccount();
  const [connected, setConnected] = useState(isConnected);

  async function signNonce(nonce) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const signature = await signer.signMessage(nonce);
      const add = await signer.getAddress();
      console.log("signature", signature, add);
      return { address: add, signature };
    } catch {
      alert(
        "Login to NexgenMl is failed. Please refresh the page and sign the message using metamask"
      );
    }
  }

  const requestSignature = async () => {
    const { nonce } = await fetchHolderNonceAPI(address);
    const result = await signNonce(nonce);

    if (result.address) {
      const data = await loginHolderAPI(result);
      if (data) {
        localStorage.setItem("auth_jwt_token", data.token);
      }
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_jwt_token");
    // window.location.reload();
  };
  const checkIfSignatureRequired = () => {
    if (!localStorage.getItem("auth_jwt_token")) {
      requestSignature();
    }
  };

  useEffect(() => {
    if (isConnected && !connected) {
      requestSignature();
      setConnected(true);
    } else if (connected && !isConnected) {
      logout();
      setConnected(false);
    } else if (isConnected) {
      checkIfSignatureRequired();
    }
  }, [isConnected]);

  return null;
};
export default LoginHandler;
