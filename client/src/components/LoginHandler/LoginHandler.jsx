/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { fetchHolderNonceAPI, loginHolderAPI } from "../../API/Holder";
import {
  getAuthToken,
  getLoggedInAddress,
  removeAuthToken,
  removeLoggedInId,
  setAuthToken,
  setLoggedInAddress,
} from "../../API/index.js";
import { useLocation } from "react-router";
const LoginHandler = () => {
  const location = useLocation();
  const { isConnected, address } = useAccount();
  const [connected, setConnected] = useState(isConnected);
  const [connectedAddress, setConnectedAddress] = useState(address);
  const signer = useSignMessage();

  async function signNonce(nonce) {
    try {
      const signature = await signer.signMessageAsync({ message: nonce });
      return { address: address, signature };
    } catch (ex) {
      console.log(ex);
      alert(
        "Login to NexgenMl is failed. Please refresh the page and sign the message using metamask"
      );
    }
  }

  const requestSignature = async () => {
    console.log("location", location);
    if (location.pathname.includes("own-a-memory")) return;
    try {
      // alert(`requesting for nonce from server: ${address}`);
      const { nonce } = await fetchHolderNonceAPI(address);
      // alert(`nonce: ${nonce}`);
      const result = await signNonce(nonce);
      // alert(`result: ${JSON.stringify(result)}`);
      if (result.address) {
        const data = await loginHolderAPI(result);
        // alert(`data: ${JSON.stringify(data)}}`);
        if (data) {
          setAuthToken(data.token);
          // alert(`signature key in local storage: ${getAuthToken()}`);
          setLoggedInAddress(result.address);
          // alert(`address key in local storage: ${getLoggedInAddress()}`);

          window.location.reload();
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const logout = () => {
    removeAuthToken();
    removeLoggedInId();
    window.location.reload();
  };
  const checkIfSignatureRequired = () => {
    const token = getAuthToken();
    if (!token) {
      requestSignature();
    }
  };

  useEffect(() => {
    if (isConnected) {
      if (address !== connectedAddress || getLoggedInAddress() !== address) {
        removeLoggedInId();
        removeAuthToken();
        setConnectedAddress(address);
        requestSignature();
        return;
      }
    }
    if (isConnected && !connected) {
      requestSignature();
      setConnected(true);
    } else if (connected && !isConnected) {
      logout();
      setConnected(false);
    } else if (isConnected) {
      checkIfSignatureRequired();
    }
  }, [isConnected, address]);

  return null;
};
export default LoginHandler;
