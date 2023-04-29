/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import AIForm from "./AIForm.jsx";
import styles from "./ConverseWithAI.module.css";
import { useState, useEffect } from "react";
import { fetchBalance } from "@wagmi/core";

export default function ConverseWithAI() {
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState("");
  const updateBalance = async () => {
    const balance = await fetchBalance({
      address: address,
      token: process.env.REACT_APP_NML_CONTRACT_ADDRESS,
    });
    setBalance(balance);
  };
  useEffect(() => {
    if (address) updateBalance();
  }, [address]);

  if (!isConnected) return null;

  if (
    parseFloat(balance.formatted) <
    process.env.REACT_APP_MIN_WALLET_BALANCE_TO_CONVERSE_WITH_AI
  )
    return null;
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
