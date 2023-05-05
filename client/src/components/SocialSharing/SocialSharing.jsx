/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { Card, Grid, Typography } from "@mui/material";
import styles from "./SocialSharing.module.css";
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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RedeemIcon from "@mui/icons-material/Redeem";
import { customFetch } from "../../API/index.js";
import { useSearchParams } from "react-router-dom";

const SocialSharing = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, _] = useSearchParams();
  const [tabValue, setTabValue] = React.useState("twitter");
  const { isConnected, address } = useAccount();
  const [stats, setStats] = useState();
  const [menuOption, setMenuOption] = useState("new");

  const fetchStats = async (tab, menuOption) => {
    const res = await customFetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-stats?mediaType=${tab}&walletId=${address}&type=${menuOption.toLowerCase()}&viewAs=${
        searchParams.get("viewAs") || ""
      }`
    );
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchStats(tabValue, "new");
  }, [tabValue]);

  const renderContent = () => {
    return (
      <div>
        <Grid className={styles.topBar} container spacing={2}>
          <Grid item md={2} sm={4}>
            <Card elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" className={styles.earningsText}>
                Overall Earnings
              </Typography>
              <Box
                display="flex"
                justifyContent={"space-around"}
                sx={{ mt: 2 }}
              >
                <Box display="flex" alignItems={"center"}>
                  <Typography variant="h6">${stats.totalPaid}</Typography>
                  <AccountBalanceWalletIcon
                    color="success"
                    fontSize="small"
                    sx={{ ml: 0.5 }}
                  />
                </Box>
                <Box display="flex" alignItems={"center"}>
                  <Typography variant="h6">${stats.totalUnpaid}</Typography>
                  <RedeemIcon
                    color="warning"
                    fontSize="small"
                    sx={{ ml: 0.5 }}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent={"space-around"}>
                <Typography variant="caption" color="var(--bs-indigo)">
                  Paid
                </Typography>
                <Typography variant="caption" color="var(--bs-indigo)">
                  Unpaid
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item md={2} sm={4}>
            <Card elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" className={styles.earningsText}>
                Today Earnings
              </Typography>
              <Box
                display="flex"
                justifyContent={"space-around"}
                sx={{ mt: 2 }}
              >
                <Box display="flex" alignItems={"center"}>
                  <Typography variant="h6">${stats.todayPaid}</Typography>
                  <AccountBalanceWalletIcon
                    color="success"
                    fontSize="small"
                    sx={{ ml: 0.5 }}
                  />
                </Box>
                <Box display="flex" alignItems={"center"}>
                  <Typography variant="h6">${stats.todayUnpaid}</Typography>
                  <RedeemIcon
                    color="warning"
                    fontSize="small"
                    sx={{ ml: 0.5 }}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent={"space-around"}>
                <Typography variant="caption" color="var(--bs-indigo)">
                  Paid
                </Typography>
                <Typography variant="caption" color="var(--bs-indigo)">
                  Unpaid
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item md={2} sm={4}>
            <Card elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" className={styles.earningsText}>
                Today Potential
              </Typography>
              <Box
                display="flex"
                justifyContent={"space-around"}
                sx={{ mt: 2 }}
              >
                <Box display="flex" alignItems={"center"}>
                  <Typography variant="h6">${stats.todayLost}</Typography>
                  <TrendingDownIcon
                    color="error"
                    fontSize="small"
                    sx={{ ml: 0.5 }}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent={"space-around"}>
                <Typography variant="caption" color="var(--bs-indigo)">
                  Available work
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <TabContext value={tabValue} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab label={`Twitter`} value="twitter" />
              {/* <Tab label="Facebook" value="facebook" /> */}
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
                  stats={stats}
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
