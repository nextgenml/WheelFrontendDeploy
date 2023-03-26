import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ConnectButton } from "@web3modal/react";
import { formatUnits } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import config from "../../config.js";
import {
  gasEstimationForAll,
  getCommas,
  ToastNotify,
  useStevenProtocolContract,
} from "../../ConnectivityAss/hooks";
import Loading from "../loading";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
  "&:hover": {
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};
export default function ClaimRedistribution() {
  const { data: signer } = useSigner();
  const { address, isConnecting, isConnected } = useAccount();
  const stevenProtocolContract = useStevenProtocolContract(signer);
  const [claimAble, setclaimAble] = useState(0);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const [loading, setloading] = useState(false);
  const init = async () => {
    try {
      const claimAbleAmount =
        await stevenProtocolContract.withdrawableDividendOf(
          address,
          config.REWARD_TOKEN
        );
      setclaimAble(formatUnits(claimAbleAmount));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (address) {
      init();
    }
  }, [address]);
  const claimHandler = async () => {
    try {
      setloading(true);

      let fn = stevenProtocolContract.estimateGas.claim;
      let params = [];
      const tx = await stevenProtocolContract.claim(...params, {
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
    <Container maxWidth="sm">
      <ToastNotify alertState={alertState} setAlertState={setAlertState} />
      <Loading loading={loading} />
      <Box sx={borderStyle} borderRadius="10px" p={2} my={10} height="100%">
        <Typography
          color="#3B7AAA"
          sx={{
            fontFamily: "Audiowide",
            textAlign: "center",
          }}
          variant="h4"
        >
          CLAIM REDISTRIBUTION
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            my: 3,
          }}
          variant="h6"
        >
          Your claimable redistribution token : {getCommas(claimAble)}
        </Typography>
        <Stack alignItems="center" my={2}>
          {isConnected ? (
            <Button
              sx={{
                bgcolor: "#2E87E5",

                fontFamily: "Audiowide",
                borderRadius: "10px",
                "&:hover": {
                  bgcolor: "#2E87E5b1",
                },
              }}
              onClick={claimHandler}
            >
              Claim
            </Button>
          ) : (
            <ConnectButton />
          )}
        </Stack>
      </Box>
    </Container>
  );
}
