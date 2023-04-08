/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Hidden,
  Button,
  Paper,
  SwipeableDrawer,
} from "@mui/material";
import { Web3Button } from "@web3modal/react";
import MenuIcon from "@mui/icons-material/Menu";
import { useAccount } from "wagmi";
import config from "../../config";
import TimeSpentCounter from "../../Utils/TimeSpentCounter";
// @ts-ignore
import styles from "./Header.module.css";
import { fetchSocialLinksAPI } from "../../API/Holder.js";
import SaveSocialLinks from "./SaveSocialLinks";

interface Props {
  socialSharing: boolean;
  whiteBg: boolean;
}
export default function Header(props: Props) {
  const { isConnected, address } = useAccount();
  const [blogDate, setBlogDate] = useState<string | null>(null);
  const [openDrawer, setState] = useState<boolean>(false);
  const [showSaveLinks, setShowSaveLinks] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<any>({});

  const fetchData = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/first-blog-at?walletId=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setBlogDate(data.createdAt);
  };
  const fetchSocialLinks = async () => {
    const data = await fetchSocialLinksAPI(address);
    setSocialLinks(data);
  };
  useEffect(() => {
    fetchData();
    fetchSocialLinks();
  }, [isConnected]);
  const linkStyle = {
    fontSize: {
      sm: "12px",
      md: "15px",
    },
  };

  const renderBlogTimer = () => {
    if (blogDate && socialLinks.facebookLink)
      return (
        <Box display="flex" alignItems={"center"}>
          <Typography className={styles.mintingText}>Point Reward:</Typography>
          <TimeSpentCounter
            timestamp={blogDate}
            className={styles.mintingText}
          />
        </Box>
      );
    else if (isConnected && !socialLinks.facebookLink) {
      return (
        <Button variant="outlined" onClick={() => setShowSaveLinks(true)}>
          Social Links
        </Button>
      );
    }
  };
  //// { link: "buy-nextgen", title: "BUY" },
  // { link: "roadmap", title: "ROADMAP" },
  //{ link: "tokenomics", title: "TOKENOMICS" },
  // { link: "converse_with_ai", title: "CONVERSE WITH AI" },
  const headerLinks = props.socialSharing
    ? [
        { link: "", title: "HOME" },
        { route: "", title: "CHORES" },
        { route: "user-campaigns", title: "CAMPAIGNS" },
        { route: "user-quizzes", title: "QUIZZES" },
      ]
    : [
        { link: "", title: "HOME" },
        { link: "goals", title: "GOALS" },
        { link: "values", title: "VALUES" },
        { link: "services", title: "SERVICES" },
        { link: "utilities", title: "UTILITIES" },
      ];

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
      {renderBlogTimer()}
      <List>
        {headerLinks
          .filter((x) => !!x)
          .map((h) => {
            return (
              <a
                href={h.link ? `/#${h.link}` : `/${h.route || ""}`}
                style={{
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  color: "black",
                }}
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
      {renderBlogTimer()}
      {showSaveLinks && (
        <SaveSocialLinks
          onClose={(saved: boolean) => {
            setShowSaveLinks(false);
            if (saved) fetchSocialLinks();
          }}
          walletId={address}
          inviteCode=""
        />
      )}
      <Hidden smDown>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 1, sm: 2, md: 2 }}
          flexBasis="40%"
          sx={{ mr: 4 }}
        >
          {headerLinks
            .filter((x) => !!x)
            .map((h) => {
              return (
                <a
                  href={h.link ? `/#${h.link}` : `/${h.route || ""}`}
                  rel="noopener noreferrer"
                  key={h.title}
                  style={{ whiteSpace: "nowrap", color: "black" }}
                >
                  <Typography className="header-link" sx={linkStyle}>
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
