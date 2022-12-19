import { Box, Button, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Contract } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
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
import { Chip } from "@mui/joy";
import { ConnectButton } from "@web3modal/react";
import { formatUnits } from "ethers/lib/utils.js";
import Loading from "../loading";
import OwnerPreviliges from "./OwnerPreviliges";

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

export default function Giveaway() {
  const { data: signer } = useSigner();
  const { address, isConnecting, isConnected } = useAccount();
  const airdropContract = useAirdropContract(signer);
  const [airdropTokens, setairdropTokens] = useState([]);
  const [selectedToken, setselectedToken] = useState(null);
  const [owner, setowner] = useState(null);

  const [airdropAmounts, setairdropAmounts] = useState({
    public: 0,
    private: 0,
  });
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const [loading, setloading] = useState(false);

  const init = async () => {
    try {
      let [tokens, admin] = await Promise.all([
        airdropContract.ListedTokens(),
        airdropContract.owner(),
      ]);
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
      setowner(admin);
      setairdropTokens(tokenArray);
      setselectedToken(tokenArray[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      init();
    }
  }, []);
  const initSelectedToken = async () => {
    let [[_1, _2, _3, _4, _5, _6, publicAmount], [_, privateAmount]] =
      await Promise.all([
        airdropContract.getAirDropValues(selectedToken?.token),
        airdropContract.getUser(selectedToken?.token, address),
      ]);
    let obj = {
      public: formatUnits(publicAmount, selectedToken?.decimals),
      private: formatUnits(privateAmount, selectedToken?.decimals),
    };
    setairdropAmounts(obj);
  };
  useEffect(() => {
    initSelectedToken();
  }, [selectedToken]);

  const publicAirdropHandler = async () => {
    try {
      setloading(true);

      let fn = airdropContract.estimateGas.claimPublicAirDrop;
      let params = [selectedToken.token];
      const tx = await airdropContract.claimPublicAirDrop(...params, {
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
  const privateAirdropHandler = async () => {
    try {
      setloading(true);

      let fn = airdropContract.estimateGas.claimPrivateAirDrop;
      let params = [selectedToken.token];
      const tx = await airdropContract.claimPrivateAirDrop(...params, {
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

  return (
    <Box id="giveaway">
      <ToastNotify alertState={alertState} setAlertState={setAlertState} />
      <Loading loading={loading} />
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        GIVEAWAY
      </Typography>

      <Grid container my={4} spacing={3} direction="row-reverse">
        <Grid item xs={12} sm={6}>
          <Box height="100%">
            <img
              src={airdropImg}
              style={{ borderRadius: "10px" }}
              width="100%"
              alt=""
            />
          </Box>
        </Grid>{" "}
        <Grid item xs={12} sm={6}>
          <Typography
            color="#3B7AAA"
            sx={{
              fontFamily: "Audiowide",
              textAlign: "left",
            }}
            variant="h5"
          >
            AIRDROP
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            my={3}
            gap="10px"
            flexWrap="wrap"
          >
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
          <Box sx={borderStyle} borderRadius="10px" p={2}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              PUBLIC AIRDROP
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "left",
              }}
              variant="h6"
            >
              Your claimable {selectedToken ? selectedToken?.name : "Token"} :{" "}
              {getCommas(airdropAmounts.public)}
            </Typography>

            <Stack alignItems="center" my={2}>
              {isConnected ? (
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
                  onClick={publicAirdropHandler}
                >
                  Claim {selectedToken ? selectedToken?.name : "Token"}
                </Button>
              ) : (
                <ConnectButton />
              )}
            </Stack>
          </Box>
          <Box sx={borderStyle} borderRadius="10px" p={2} mt={2}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              PRIVATE AIRDROP
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "left",
              }}
              variant="h6"
            >
              Your claimable {selectedToken ? selectedToken?.name : "Token"} :{" "}
              {getCommas(airdropAmounts.private)}
            </Typography>

            <Stack alignItems="center" my={2}>
              {isConnected ? (
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
                  onClick={privateAirdropHandler}
                >
                  Claim {selectedToken ? selectedToken?.name : "Token"}
                </Button>
              ) : (
                <ConnectButton />
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {address && owner?.toLowerCase() === address?.toLowerCase() && (
        <OwnerPreviliges />
      )}
    </Box>
  );
}
