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
        backgroundSize: { xs: "100% 100%", sm: "50% 80%" },
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
            NEXTGEN ML TOKEN
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
            We help empower communities to own and monetize data in the
            decentralized world. Our advanced Blockchain AI solutions help with
            data automation, leading to new products, new services, tweaks to
            existing products to make them less costly or more valuable, and an
            array of other advantages. Ultimately, this will make the token more
            competitive in the rapidly changing digital landscape. 
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <a
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
                BUY NEXTGEN
              </Button>
            </a>

            <Link
              to="/spin-wheel"
              target="_blank"
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
                LAUNCH WHEEL
              </Button>
            </Link>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
