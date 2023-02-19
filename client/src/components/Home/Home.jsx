import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import homeimg from "./assets/home.png";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box
      py={15}
      sx={{
        background: `url(${homeimg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: { xs: "100% 100%", sm: "30% 90%" },
        backgroundPosition: "center right",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography
            color="#3B7AAA"
            sx={{
              fontFamily: "Audiowide",
            }}
            variant="h3"
          >
            NEXGEN ML TOKEN
          </Typography>
          <Typography
            color="white"
            sx={{
              textDecoration: "none",
              textAlign: "justify",
            }}
            fontWeight="bold"
            my={3}
          >
            NEXGEN ML empowers communities with the ownership and monetization
            of data in a decentralized world through our advanced blockchain AI
            solutions. Our platform streamlines data automation, unlocking new
            revenue streams and providing a competitive edge in the rapidly
            evolving digital landscape. From creating new products and services
            to improving existing offerings, our solutions will drive growth and
            innovation. Join us in the journey to secure control and value from
            your data in the decentralized era. 
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <a
              href="#buy-nextgen"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button
                sx={{
                  bgcolor: "#2E87E5",
                  color: "white",
                  my: 2,
                  fontFamily: "Audiowide",
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: "#2E87E5b1",
                  },
                }}
              >
                BUY NEXGEN
              </Button>
            </a> */}

            {/* <Button
              sx={{
                bgcolor: "#2E87E5",
                color: "white",
                my: 2,
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
              LAUNCH WHEEL
            </Button> */}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
