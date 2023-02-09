import { Stack } from "@mui/joy";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import spinwheelImg from "./assets/spinwheel.png";

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
export default function GameSection() {
  return (
    <Container maxWidth="lg">
      <Box sx={borderStyle} borderRadius="10px" p={2} my={10} height="100%">
        <Typography
          color="#3B7AAA"
          sx={{
            fontFamily: "Audiowide",
            textAlign: "center",
          }}
          variant="h4"
        >
          WHEEL
        </Typography>

        <Typography
          color="white"
          sx={{
            textAlign: "center",
          }}
        >
          Earn your chance to win rewards in stable coins by purchasing & holding NEXGEN ML erc -20 token
        </Typography>

        <Grid
          container
          columnSpacing={3}
          mt={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "left",
                my: 3,
              }}
              variant="h5"
            >
              RULES
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
              }}
            >
              To qualify for extraordinary rewards, you must purchase a minimum of 1 million NEXGEN ML tokens and hold them in your wallet. The longer you hold the tokens, the more chances you have to qualify for a spin to win rewards. Our advanced AI program will pick up wallet addresses from the smart contract and select winners based on the rules, making draws weekly, bi-weekly, monthly, quarterly, semi-annually, and annually. By purchasing NEXGEN ML tokens and holding them long-term, you can secure your spot on the whitelist and access future airdrops and NFTs for various initiatives with unique utilities. So, join the NEXGEN ML community and start reaping the benefits of long-term token holding.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Box>
              <img
                src={spinwheelImg}
                style={{ borderRadius: "10px", maxHeight: "400px" }}
                alt=""
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Stack alignItems="center">
              <Link to="/spin-wheel" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    bgcolor: "#2E87E5",
                    color: "white",
                    my: 2,
                    p: 2,

                    fontFamily: "Audiowide",
                    borderRadius: "10px",
                    "&:hover": {
                      bgcolor: "#2E87E5b1",
                    },
                  }}
                  onClick={() => {
                    return window.open(
                      "/spin-wheel",
                      "Windows",
                      "width=650,height=350,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no,addressbar=no"
                    );
                  }}
                >
                  Launch
                </Button>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
