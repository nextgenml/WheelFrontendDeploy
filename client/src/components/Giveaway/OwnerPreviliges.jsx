import { Box, Button, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Contract } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import {
  gasEstimationForAll,
  getCommas,
  ToastNotify,
  useAirdropContract,
  voidAccount,
} from "../../ConnectivityAss/hooks";
import tokenAbi from "../../ConnectivityAss/tokenAbi.json";
import airdropImg from "./assets/airdrop.jpg";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Chip, TextField } from "@mui/joy";
import { ConnectButton } from "@web3modal/react";
import { formatUnits, hexlify, parseUnits } from "ethers/lib/utils.js";
import Loading from "../loading";
import { airDropAddress } from "../../ConnectivityAss/environment";
import CSVReader from "./CsvReader";

let borderStyle = {
  color: "white",
  width: "100%",
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
  "&:hover": {
    color: "white",
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};

export default function OwnerPreviliges() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const airdropContract = useAirdropContract(signer);
  const provider = useProvider();
  const [airdropTokens, setairdropTokens] = useState([]);
  const [selectedToken, setselectedToken] = useState(null);
  const [selectedToken1, setselectedToken1] = useState(null);
  const [tokenAddress, settokenAddress] = useState("");
  const [tokenAmount, settokenAmount] = useState("");
  const [addressesArray, setaddressesArray] = useState([]);
  const [amountsArray, setamountsArray] = useState([]);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const [loading, setloading] = useState(false);
  console.log(selectedToken, "selectedToken");

  const init = async () => {
    try {
      let [tokens] = await Promise.all([airdropContract.ListedTokens()]);
      let tokenArray = [];
      for (let index = 0; index < tokens.length; index++) {
        if (tokens[index] !== "0x0000000000000000000000000000000000000000") {
          let tokenNameContract = new Contract(
            tokens[index],
            tokenAbi,
            voidAccount
          );
          let [name, decimals] = await Promise.all([
            tokenNameContract.name(),
            tokenNameContract.decimals(),
          ]);
          let obj = { name, decimals, token: tokens[index] };
          tokenArray.push(obj);
        } else {
          let obj = {
            name: "ETH",
            decimals: "18",
            token: "0x0000000000000000000000000000000000000000",
          };
          tokenArray.push(obj);
        }
      }
      setairdropTokens(tokenArray);
      setselectedToken(tokenArray[0]);
      setselectedToken1(tokenArray[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      init();
    }
  }, []);

  const setTokenHandler = async () => {
    try {
      let tokenNameContract = new Contract(tokenAddress, tokenAbi, voidAccount);
      let name = await tokenNameContract.decimals();
    } catch (error) {
      console.log(error, "tokenNameContract");
      setAlertState({
        open: true,
        message: "Please Enter a valid Token Address.",
        severity: "error",
      });
      return;
    }
    try {
      setloading(true);

      let fn = airdropContract.estimateGas.listToken;
      let params = [tokenAddress];
      const tx = await airdropContract.listToken(...params, {
        gasLimit: gasEstimationForAll(address, fn, params),
      });
      await tx.wait();
      setAlertState({
        open: true,
        message: "Transaction Successful.",
        severity: "success",
      });
      setloading(false);
      init();
    } catch (error) {
      setloading(false);
      if (error?.data?.message) {
        setAlertState({
          open: true,
          message: error?.data?.message,
          severity: "error",
        });
      } else if (error?.reason) {
        setAlertState({
          open: true,
          message: error?.reason,
          severity: "error",
        });
      } else {
        setAlertState({
          open: true,
          message: error?.message,
          severity: "error",
        });
      }
      console.log("e", error);
    }
  };
  const depositHandler = async () => {
    try {
      setloading(true);
      if (!tokenAmount || isNaN(tokenAmount) || +tokenAmount <= 0) {
        setAlertState({
          open: true,
          message: "Please enter valid amount.",
          severity: "error",
        });
      } else {
        if (
          selectedToken?.token === "0x0000000000000000000000000000000000000000"
        ) {
          let [gasLimit, transactionCount] = await Promise.all([
            provider.getGasPrice(),
            signer.getTransactionCount("latest"),
          ]);
          let txdata = {
            to: airDropAddress,
            value: parseUnits(tokenAmount.toString()),
            nonce: transactionCount,
            gasLimit: hexlify(21000), // 100000
            gasPrice: gasLimit,
          };
          let tx = await signer.sendTransaction(txdata);
          await tx.wait();
        } else {
          let tokenNameContract = new Contract(
            selectedToken.token,
            tokenAbi,
            signer
          );
          let fn = tokenNameContract.estimateGas.transfer;
          let params = [
            airDropAddress,
            parseUnits(tokenAmount.toString(), selectedToken.decimals),
          ];
          const tx = await tokenNameContract.transfer(...params, {
            gasLimit: gasEstimationForAll(address, fn, params),
          });
          await tx.wait();
        }
        setAlertState({
          open: true,
          message: "Transaction Successful.",
          severity: "success",
        });
        setloading(false);
        init();
      }
    } catch (error) {
      setloading(false);
      if (error?.data?.message) {
        setAlertState({
          open: true,
          message: error?.data?.message,
          severity: "error",
        });
      } else if (error?.reason) {
        setAlertState({
          open: true,
          message: error?.reason,
          severity: "error",
        });
      } else {
        setAlertState({
          open: true,
          message: error?.message,
          severity: "error",
        });
      }
      console.log("e", error);
    }
  };
  const whitelistHandler = async () => {
    try {
      setloading(true);
      if (addressesArray.length !== addressesArray.length) {
        setAlertState({
          open: true,
          message: "Please select CSV file with correct entries.",
          severity: "error",
        });
      } else if (addressesArray.length === 0 || addressesArray.length === 0) {
        setAlertState({
          open: true,
          message: "Please select CSV.",
          severity: "error",
        });
      } else {
        let fn = airdropContract.estimateGas.privateAirDrop;
        let params = [addressesArray, amountsArray, selectedToken1.token];
        const tx = await airdropContract.privateAirDrop(...params, {
          gasLimit: gasEstimationForAll(address, fn, params),
        });
        await tx.wait();
        setAlertState({
          open: true,
          message: "Transaction Successful.",
          severity: "success",
        });
        setloading(false);
        init();
      }
    } catch (error) {
      setloading(false);
      if (error?.data?.message) {
        setAlertState({
          open: true,
          message: error?.data?.message,
          severity: "error",
        });
      } else if (error?.reason) {
        setAlertState({
          open: true,
          message: error?.reason,
          severity: "error",
        });
      } else {
        setAlertState({
          open: true,
          message: error?.message,
          severity: "error",
        });
      }
      console.log("e", error);
    }
  };

  return (
    <Box>
      <ToastNotify alertState={alertState} setAlertState={setAlertState} />
      <Loading loading={loading} />

      <Grid container my={4} spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8}>
          <Box sx={borderStyle} borderRadius="10px" p={2}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h5"
            >
              OWNER PREVILIGES
            </Typography>

            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Add New Token
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              my={3}
              gap="10px"
              flexWrap="wrap"
            >
              <TextField
                placeholder="Type token address…"
                startDecorator={<img src="/favicon.png" width="30px" />}
                // sx={borderStyle}
                endDecorator={
                  <Chip size="sm" variant="soft" sx={{ bgcolor: "#3B7AAA" }}>
                    Token
                  </Chip>
                }
                value={tokenAddress}
                onChange={(e) => settokenAddress(e.target.value)}
                sx={{ flexBasis: "60%" }}
              />

              <Button
                sx={{
                  bgcolor: "#2E87E5",
                  color: "white",
                  fontFamily: "Audiowide",
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: "#2E87E5b1",
                  },
                }}
                onClick={setTokenHandler}
              >
                Add Token
              </Button>
            </Stack>

            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Deposit
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} my={3}>
              <Typography
                color="white"
                sx={{
                  textAlign: "center",
                  flexBasis: "30%",
                }}
              >
                Select Token :
              </Typography>
              <Select
                placeholder="Select a Token..."
                startDecorator={<img src="/favicon.png" width="30px" />}
                // ={{ sx: { color: "white" } }}
                endDecorator={
                  <Chip
                    size="sm"
                    sx={{ bgcolor: "#3B7AAA" }}
                    color="danger"
                    variant="soft"
                  >
                    {airdropTokens?.length}
                  </Chip>
                }
                sx={borderStyle}
                slotProps={{
                  listbox: {
                    component: "div",
                    sx: {
                      ...borderStyle,
                      background:
                        "linear-gradient(0deg, rgba(251,156,5,1) 0%, rgba(59,122,170,1) 100%)",
                      "--List-padding": "0px",
                    },
                  },
                }}
                defaultValue={0}
                onChange={(e, newValue) =>
                  setselectedToken(airdropTokens[newValue])
                }
              >
                {airdropTokens?.length > 0 ? (
                  airdropTokens.map(({ name, token }, index) => (
                    <Option
                      value={index}
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      key={index}
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "white",
                        },
                        width: 300,
                      }}
                    >
                      {console.log(index, "index")}
                      {name}
                    </Option>
                  ))
                ) : (
                  <Typography
                    color="white"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    No Token Added.
                  </Typography>
                )}
              </Select>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              gap="10px"
              flexWrap="wrap"
              my={3}
            >
              <TextField
                placeholder={`Type amount in ${
                  selectedToken?.name ? selectedToken?.name : "Token"
                }…`}
                startDecorator={<img src="/favicon.png" width="30px" />}
                // sx={borderStyle}
                endDecorator={
                  <Chip size="sm" variant="soft" sx={{ bgcolor: "#3B7AAA" }}>
                    {selectedToken?.name ? selectedToken?.name : "Token"}
                  </Chip>
                }
                type="number"
                min="0"
                value={tokenAmount}
                onChange={(e) => settokenAmount(e.target.value)}
                sx={{ flexBasis: "60%" }}
              />

              <Button
                sx={{
                  bgcolor: "#2E87E5",
                  color: "white",
                  fontFamily: "Audiowide",
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: "#2E87E5b1",
                  },
                }}
                onClick={depositHandler}
              >
                Deposit
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={borderStyle} borderRadius="10px" p={2}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h5"
            >
              WHITELIST
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} my={3}>
              <Typography
                color="white"
                sx={{
                  textAlign: "center",
                  flexBasis: "30%",
                }}
              >
                Select Token :
              </Typography>
              <Select
                placeholder="Select a Token..."
                startDecorator={<img src="/favicon.png" width="30px" />}
                // ={{ sx: { color: "white" } }}
                endDecorator={
                  <Chip
                    size="sm"
                    sx={{ bgcolor: "#3B7AAA" }}
                    color="danger"
                    variant="soft"
                  >
                    {airdropTokens?.length}
                  </Chip>
                }
                sx={borderStyle}
                slotProps={{
                  listbox: {
                    component: "div",
                    sx: {
                      ...borderStyle,
                      background:
                        "linear-gradient(0deg, rgba(251,156,5,1) 0%, rgba(59,122,170,1) 100%)",
                      "--List-padding": "0px",
                    },
                  },
                }}
                defaultValue={0}
                onChange={(e, newValue) =>
                  setselectedToken1(airdropTokens[newValue])
                }
              >
                {airdropTokens?.length > 0 ? (
                  airdropTokens.map(({ name, token }, index) => (
                    <Option
                      value={index}
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "white",
                        },
                        width: 300,
                      }}
                    >
                      {name}
                    </Option>
                  ))
                ) : (
                  <Typography
                    color="white"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    No Token Added.
                  </Typography>
                )}
              </Select>
            </Stack>
            <CSVReader
              setaddressesArray={setaddressesArray}
              setamountsArray={setamountsArray}
              selectedToken={selectedToken1}
            />
            <Stack alignItems="center" my={2}>
              <Button
                sx={{
                  bgcolor: "#2E87E5",
                  color: "white",
                  fontFamily: "Audiowide",
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: "#2E87E5b1",
                  },
                }}
                onClick={whitelistHandler}
              >
                Whitelist
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
