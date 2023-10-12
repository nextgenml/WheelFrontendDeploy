/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import AIForm from "./AIForm.jsx";
import styles from "./ConverseWithAI.module.css";
import { useState, useEffect } from "react";
import { fetchBalance } from "@wagmi/core";
import { getAPICall } from "../../API/index.js";
import config from "../../config.js";

export default function ConverseWithAI() {
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState("");
  const [holder, setHolder] = useState({});
  const updateBalance = async () => {
    const balance = await fetchBalance({
      address: address,
      token: process.env.REACT_APP_NML_CONTRACT_ADDRESS,
    });
    setBalance(balance);
  };
  const fetchHolder = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/holders/details`,
      true
    );
    setHolder(data);
  };

  useEffect(() => {
    if (address) {
      updateBalance();
      fetchHolder();
    }
  }, [address]);

  if (!isConnected) return null;

  console.log("balance", balance);
  // if (
  //   holder.is_banned ||
  //   parseFloat(balance.formatted) < holder.minimum_balance_for_ai
  // )
  //   return null;
  return (
    <Box my={5} id="converse_with_ai">
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        CONVERSE WITH AI
      </Typography>

      <Grid container mt={4} spacing={3}>
        <Grid item xs={12} className={styles.aiBox}>
          <AIForm />
        </Grid>
      </Grid>
    </Box>
  );
}
