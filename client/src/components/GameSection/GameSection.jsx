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
          GAME
        </Typography>

        <Typography
          color="white"
          sx={{
            textAlign: "center",
          }}
        >
          Earn your chance to win Call of duty points, double xp, merch, games,
          etc by purchasing NEXTGEN ML erc -20 token
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
              Must purchase minimum 0.01 worth of NEXTGEN ML to qualify. Must
              hold the token, The longer you hold the more chances you get to
              WIN. With every purchase, wallet addresses will be monitored and
              entered into giveaway as long as wallet qualifies. There is no
              limit to entries. We want to reward our loyal community members
              with special MODERN WAREFARE II items such as CALL OF DUTY points,
              double xp, merch, games etc on all gaming platforms PS5, XBOX, PC
              etc
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
                    p: 2,

                    fontFamily: "Audiowide",
                    borderRadius: "10px",
                    "&:hover": {
                      bgcolor: "#2E87E5b1",
                    },
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
