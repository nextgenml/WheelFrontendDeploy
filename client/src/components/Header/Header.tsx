import React, { useState } from "react";
import {
  Stack,
  Typography,
  Box,
  List,
  makeStyles,
  ListItem,
  ListItemText,
  Hidden,
  Button,
  Paper,
  SwipeableDrawer,
} from "@mui/material";
import { Web3Button } from "@web3modal/react";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
  const [openDrawer, setState] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };
  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ width: "240px" }}
    >
      <Box mt={-20} display="flex" justifyContent="center">
        <img width="150px" src="/logo.png" alt="" />
      </Box>
      <List>
        <a href="#" style={{ textDecoration: "none" }}>
          <ListItem
            button
            style={{
              justifyContent: "center",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Audiowide",
                },
              }}
              primary="HOME"
            />
          </ListItem>
        </a>
        <a href="#goals" style={{ textDecoration: "none" }}>
          <ListItem
            button
            style={{
              justifyContent: "center",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Audiowide",
                },
              }}
              primary="OUR GOALS"
            />
          </ListItem>
        </a>
        <a href="#tokenomics" style={{ textDecoration: "none" }}>
          <ListItem
            button
            style={{
              justifyContent: "center",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Audiowide",
                },
              }}
              primary="TOKENOMICS"
            />
          </ListItem>
        </a>
        <a href="#buy-nextgen" style={{ textDecoration: "none" }}>
          <ListItem
            button
            style={{
              justifyContent: "center",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Audiowide",
                },
              }}
              primary="BUY NEXTGEN"
            />
          </ListItem>
        </a>
        <a href="#giveaway" style={{ textDecoration: "none" }}>
          <ListItem
            button
            style={{
              justifyContent: "center",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  textTransform: "capitalize",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Audiowide",
                },
              }}
              primary="GIVEAWAY"
            />
          </ListItem>
        </a>
      </List>
      <Box mb={1} display="flex" justifyContent="center">
        <Web3Button />
      </Box>
    </Box>
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={{ xs: "space-between", sm: "center" }}
      spacing={1}
    >
      {" "}
      <Hidden smDown>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 1, sm: 2, md: 2 }}
          flexBasis="40%"
        >
          <a href="#" rel="noopener noreferrer">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textDecoration: "none",
                fontSize: { sm: "12px", md: "15px" },
              }}
            >
              HOME
            </Typography>
          </a>
          <a href="#goals" rel="noopener noreferrer">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textDecoration: "none",
                fontSize: { sm: "12px", md: "15px" },
              }}
            >
              OUR GOALS
            </Typography>
          </a>
          <a href="#tokenomics" rel="noopener noreferrer">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textDecoration: "none",
                fontSize: { sm: "12px", md: "15px" },
              }}
            >
              TOKENOMICS
            </Typography>
          </a>
        </Stack>
      </Hidden>
      <Box
        width={{ xs: "150px", sm: "200px" }}
        flexBasis={{ xs: "auto", sm: "15%" }}
      >
        <img src="/logo.png" width="100%" />
      </Box>
      <Hidden smDown>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 1, sm: 2, md: 2 }}
          flexBasis="40%"
        >
          <a href="#buy-nextgen" rel="noopener noreferrer">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textDecoration: "none",
                fontSize: { sm: "12px", md: "15px" },
              }}
            >
              BUY NEXTGEN
            </Typography>
          </a>
          <a href="#giveaway" rel="noopener noreferrer">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textDecoration: "none",
                fontSize: { sm: "12px", md: "15px" },
              }}
            >
              GIVEAWAY
            </Typography>
          </a>

          <Web3Button />
        </Stack>
      </Hidden>
      <Hidden smUp>
        <Box>
          <Button onClick={toggleDrawer(true)} style={{ zIndex: 1 }}>
            <MenuIcon
              style={{
                fontSize: "38px",
                cursor: "pointer",
                color: "white",
              }}
            ></MenuIcon>
          </Button>
          <Paper style={{ background: "#0A2444" }}>
            <SwipeableDrawer
              PaperProps={{
                sx: {
                  background: "#1C0D38 !important",
                  justifyContent: "center",
                },
              }}
              anchor="left"
              open={openDrawer}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {list()}
            </SwipeableDrawer>
          </Paper>
        </Box>
      </Hidden>
    </Stack>
  );
}
