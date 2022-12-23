import { Box, Grid, Typography } from "@mui/material";
import React from "react";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
};
export default function ConverseWithAI() {
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
        <Grid item xs={12}>
          <iframe
            title="converse-with-ai"
            src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f"
            height="660px"
            width="100%"
            style={{
              ...{
                border: "0",
                margin: "0 auto",
                marginBottom: ".5rem",
                display: "block",
                borderRadius: "10px",
                maxWidth: "960px",
                minWidth: "300px",
              },
              ...borderStyle,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
