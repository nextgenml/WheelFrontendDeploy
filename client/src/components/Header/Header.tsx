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

const linkStyle = { fontSize: { sm: "12px", md: "15px" } };
const headerLinks = [
  { link: "", title: "HOME" },
  { link: "goals", title: "GOALS" },
  { link: "values", title: "VALUES" },
  { link: "tokenomics", title: "TOKENOMICS" },
  { link: "services", title: "SERVICES" },
  { link: "roadmap", title: "ROADMAP" },
  { link: "utilities", title: "UTILITIES" },
  { link: "buy-nextgen", title: "BUY" },
  { link: "converse_with_ai", title: "CONVERSE WITH AI" },
];

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
  const mobileNavLinks = () => (
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
        {headerLinks.map((h) => {
          return (
            <a
              href={`/#${h.link}`}
              style={{ textDecoration: "none", whiteSpace: "nowrap" }}
              key={h.title}
            >
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
                  primary={h.title}
                />
              </ListItem>
            </a>
          );
        })}
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
      justifyContent={{ xs: "space-between" }}
      spacing={1}
    >
      <Box
        width={{ xs: "150px", sm: "200px" }}
        flexBasis={{ xs: "auto", sm: "15%" }}
        sx={{ p: 1 }}
      >
        <img src="/logo.png" width="100%" alt="logo" />
      </Box>
      <Hidden smDown>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 1, sm: 2, md: 2 }}
          flexBasis="40%"
          sx={{ mr: 4 }}
        >
          {headerLinks.map((h) => {
            return (
              <a
                href={`/#${h.link}`}
                rel="noopener noreferrer"
                key={h.title}
                style={{ whiteSpace: "nowrap" }}
              >
                <Typography
                  className="header-link"
                  color="white"
                  sx={linkStyle}
                >
                  {h.title}
                </Typography>
              </a>
            );
          })}
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
              {mobileNavLinks()}
            </SwipeableDrawer>
          </Paper>
        </Box>
      </Hidden>
    </Stack>
  );
}
