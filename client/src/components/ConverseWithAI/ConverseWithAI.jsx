import { Box, Grid, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import AIForm from "./AIForm.jsx";
import styles from "./ConverseWithAI.module.css";

export default function ConverseWithAI() {
  const { isConnected } = useAccount();
  if (!isConnected) return null;
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
