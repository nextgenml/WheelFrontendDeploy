import { Box, Grid, Typography } from "@mui/material";
import React from "react";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
};
export default function BuyNextGen() {
  return (
    <Box my={5} id="buy-nexgen">
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        BUY NEXGEN ML
      </Typography>

      <Grid container mt={4} spacing={3}>
        <Grid item xs={12}>
          <iframe
            title="buy_nextgenml"
            src="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3858dad8a5b3364be56de0566ab59e3d656c51f6"
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
