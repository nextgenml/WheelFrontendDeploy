/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
  Link,
} from "@mui/material";
import { Web3Button } from "@web3modal/react";
import MenuIcon from "@mui/icons-material/Menu";
import { useAccount } from "wagmi";
import TimeSpentCounter from "../../Utils/TimeSpentCounter";
// @ts-ignore
import styles from "./Header.module.css";
import SaveSocialLinks from "./SaveSocialLinks";
import InternalApps from "./InternalApps";
import { useNavigate } from "react-router";
import LoginHandler from "../LoginHandler/LoginHandler";
import config from "../../config";
import { getAPICall } from "../../API/index.js";

export default function Header() {
  const { isConnected, address } = useAccount();
  const [blogDate, setBlogDate] = useState<string | null>(null);
  const [openDrawer, setState] = useState<boolean>(false);
  const [showSaveLinks, setShowSaveLinks] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const navigate = useNavigate();
  const fetchHolder = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/holders/details`,
      true
    );
    setSocialLinks(data);
    setBlogDate(data.pointRewardsStartAt);
  };
  useEffect(() => {
    fetchHolder();
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
  };
  // { link: "roadmap", title: "ROADMAP" },
  //{ link: "tokenomics", title: "TOKENOMICS" },
  // { link: "converse_with_ai", title: "CONVERSE WITH AI" },
  // { link: "buy-nexgen", title: "BUY" },

  const headerLinks = [
    { link: "/", title: "HOME" },
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
  const socialLinksBtn = () => {
    return (
      <>
        {isConnected && (
          <Link
            href="#"
            rel="noopener noreferrer"
            style={{
              whiteSpace: "nowrap",
              color: "black",
              textAlign: "center",
            }}
            onClick={() => setShowSaveLinks(true)}
          >
            <Typography className="header-link" sx={linkStyle}>
              SOCIAL LINKS
            </Typography>
          </Link>
        )}
      </>
    );
  };
  const mobileNavLinks = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ width: "240px", cursor: "pointer" }}
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
                href={h.link}
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
                        fontFamily: "Audiowide",
                      },
                    }}
                    primary={h.title}
                  />
                </ListItem>
              </a>
            );
          })}
        <InternalApps />
        {socialLinksBtn()}
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
      sx={{ p: 2 }}
    >
      <Box
        width={{ xs: "150px", sm: "200px" }}
        flexBasis={{ xs: "auto", sm: "15%" }}
        sx={{ p: 1, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img src="/logo.png" width="100%" alt="logo" />
      </Box>
      {renderBlogTimer()}
      <LoginHandler />
      {showSaveLinks && (
        <SaveSocialLinks
          onClose={(saved: boolean) => {
            setShowSaveLinks(false);
            if (saved) fetchHolder();
          }}
          links={socialLinks}
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
                  // onClick={() => navigate(h.route || `/#${h.link}`)}
                  href={h.link}
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
          {socialLinksBtn()}
          <InternalApps />
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
                  justifyContent: "center",
                  p: 2,
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
