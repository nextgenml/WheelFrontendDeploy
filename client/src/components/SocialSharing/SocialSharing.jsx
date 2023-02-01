/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { Grid, Typography } from "@mui/material";
import styles from "./SocialSharing.module.css";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import NavBar from "./NavBar";
import Content from "./ChoresContent";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import config from "../../config";
import Loading from "../loading";
import { useAccount } from "wagmi";
import Instructions from "./Instructions";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const SocialSharing = () => {
  const [tabValue, setTabValue] = React.useState("twitter");
  const { isConnected, address } = useAccount();
  const [stats, setStats] = useState();
  const [menuOption, setMenuOption] = useState("new");
  const [walletDetails, setWalletDetails] = useState({});
  const fetchStats = async (tab, menuOption) => {
    const res = await fetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-stats?mediaType=${tab}&walletId=${address}&type=${menuOption.toLowerCase()}`
    );
    const data = await res.json();
    setStats(data);
  };

  const getWalletDetails = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/get-wallet-details?walletId=${address}`
    );
    const data = await res.json();
    setWalletDetails(data);
  };

  useEffect(() => {
    getWalletDetails();
  }, []);

  useEffect(() => {
    fetchStats(tabValue, "new");
  }, [tabValue]);

  const renderContent = () => {
    return (
      <div>
        <Grid className={styles.topBar} container spacing={2}>
          <Grid item md={2} sm={4}>
            <div className={styles.earnings}>
              <Typography variant="h6">${stats.total}</Typography>
              <AccountBalanceWalletIcon color="primary" />
            </div>
            <Typography variant="body2" className={styles.earningsText}>
              Total Earnings
            </Typography>
          </Grid>
          <Grid item md={2} sm={4}>
            <div className={styles.earnings}>
              <Typography variant="h6">${stats.today}</Typography>
              <TrendingUpIcon color="success" />
            </div>
            <Typography variant="body2" className={styles.earningsText}>
              Today Earnings
            </Typography>
          </Grid>
          {/* <Grid item md={2} sm={4}>
            <div className={styles.earnings}>
              <Typography variant="h6">${stats.todayMax}</Typography>
              <RestartAltRoundedIcon color="warning" />
            </div>
            <Typography variant="body2" className={styles.earningsText}>
              Today Max Earnings
            </Typography>
          </Grid> */}
          <Grid item md={2} sm={4}>
            <div className={styles.earnings}>
              <Typography variant="h6">${stats.todayLost}</Typography>
              <TrendingDownIcon color="error" />
            </div>
            <Typography variant="body2" className={styles.earningsText}>
              Today Lost
            </Typography>
          </Grid>
          <Grid item md={6} sm={4} textAlign={"right"}>
            <Instructions
              generatedAlias={walletDetails.alias}
              address={address}
            />
          </Grid>
        </Grid>

        <TabContext value={tabValue} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab label={`Twitter`} value="twitter" />
              <Tab label="Facebook" value="facebook" />
            </TabList>
          </Box>

          <TabPanel value="twitter">
            <Grid container spacing={2}>
              <Grid item md={3}>
                <NavBar
                  stats={stats}
                  onMenuChange={(option) => setMenuOption(option)}
                />
              </Grid>
              <Grid item md={9}>
                <Content
                  tab={"twitter"}
                  walletId={address}
                  menuOption={menuOption}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="facebook"></TabPanel>
        </TabContext>
      </div>
    );
  };
  return (
    <div className={styles.main}>
      {isConnected ? (
        <>{stats ? renderContent() : <Loading loading />}</>
      ) : (
        <Typography variant="h6" sx={{ mb: 20 }}>
          Please connect your wallet
        </Typography>
      )}
    </div>
  );
};
export default SocialSharing;
