/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { fetchHolderNonceAPI, loginHolderAPI } from "../../API/Holder";
import { getAPICall, removeAuthToken, setAuthToken } from "../../API/index.js";
import config from "../../config";
import { writeAPICall } from "../../API/index.js";
const LoginHandler = () => {
  const { isConnected, address } = useAccount();
  const [connected, setConnected] = useState(isConnected);
  const connectedAddress = useRef(address);
  const signer = useSignMessage();

  async function signNonce(nonce) {
    try {
      console.log("called signNonce");
      const signature = await signer.signMessageAsync({ message: nonce });
      return { address: address, signature };
    } catch (ex) {
      // alert(
      //   "Invalid session. Please disconnect and reconnect your metamask wallet again"
      // );
      console.error("error in signNonce", ex);
    }
  }

  const requestSignature = async () => {
    console.log("called requestSignature");
    const { nonce } = await fetchHolderNonceAPI(address);
    const result = await signNonce(nonce);

    if (result && result.address) {
      const data = await loginHolderAPI(result);
      if (data) {
        setAuthToken(true);
        window.location.reload();
      }
    }
  };
  const logout = async () => {
    removeAuthToken();
    await writeAPICall(
      `${config.API_ENDPOINT}/api/v1/holders/logout`,
      {},
      "DELETE",
      true
    );
    window.location.reload();
  };
  const checkIfSignatureRequired = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/holders/signingRequired`
    );
    if (!res.success) requestSignature();
  };

  useEffect(() => {
    console.log("isConnected", isConnected, "address", address);
    if (isConnected) {
      if (address !== connectedAddress.current) {
        connectedAddress.current = address;
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
