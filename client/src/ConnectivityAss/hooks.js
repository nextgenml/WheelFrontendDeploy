import React from "react";
import { Contract } from "@ethersproject/contracts";
import tokenAbi from "./tokenAbi.json";
import airDropAbi from "./airDropAbi.json";

import { airDropAddress, tokenAddress } from "./environment.js";
import { BigNumber, constants, ethers } from "ethers";

import { Alert, Slide, Snackbar } from "@mui/material";
let walletAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
let { MaxUint256 } = constants;

const provider = new ethers.providers.JsonRpcProvider(
  // "https://data-seed-prebsc-1-s1.binance.org:8545/"
  // "https://bsc-dataseed.binance.org/"
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  // "https://api.avax-test.network/ext/bc/C/rpc"
);
export const voidAccount = new ethers.VoidSigner(walletAddress, provider);
function useContract(address, ABI, signer) {
  return React.useMemo(() => {
    if (signer) {
      return new Contract(address, ABI, signer);
    } else {
      return new Contract(address, ABI, voidAccount);
    }
  }, [address, ABI, signer]);
}

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}
export function useAirdropContract(signer) {
  return useContract(airDropAddress, airDropAbi, signer);
}
export function useTokenContract(signer) {
  return useContract(tokenAddress, tokenAbi, signer);
}

////////////////////////////////////////////////////////////////
export function ToastNotify({ alertState, setAlertState }) {
  return (
    <Snackbar
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={alertState.open}
      autoHideDuration={3000}
      key={"top" + "center"}
      onClose={() => setAlertState({ ...alertState, open: false })}
      sx={{ zIndex: "1500" }}
    >
      <Alert
        onClose={() => setAlertState({ ...alertState, open: false })}
        severity={alertState.severity}
      >
        {alertState.message}
      </Alert>
    </Snackbar>
  );
}

export let getCommas = (value) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// add 10%
export function calculateGasMargin(value) {
  return +(
    (value * BigNumber.from(10000).add(BigNumber.from(1000))) /
    BigNumber.from(10000)
  ).toFixed(0);
  // return value;
}
//CalculatePayableGas
export const gasEstimationPayable = async (account, fn, data, amount) => {
  if (account) {
    const estimateGas = await fn(...data, MaxUint256).catch(() => {
      return fn(...data, { value: amount.toString() });
    });
    return calculateGasMargin(estimateGas);
  }
};
export const gasEstimationForAll = async (account, fn, data) => {
  if (account) {
    const estimateGas = await fn(...data, MaxUint256).catch(() => {
      return fn(...data);
    });
    return calculateGasMargin(estimateGas);
  }
};
