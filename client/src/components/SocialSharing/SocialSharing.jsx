import * as React from "react";

import { Grid, Typography } from "@mui/material";
import styles from "./SocialSharing.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import NavBar from "./NavBar";
import Content from "./Content";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const SocialSharing = () => {
  const [tabValue, setTabValue] = React.useState("twitter");

  return (
    <div className={styles.main}>
      <Grid className={styles.topBar} container spacing={2}>
        <Grid item md={2} sm={4}>
          <div className={styles.earnings}>
            <Typography variant="h6">$121.00</Typography>
          </div>
          <Typography variant="body2" className={styles.earningsText}>
            Total Earnings
          </Typography>
        </Grid>
        <Grid item md={2} sm={4}>
          <div className={styles.earnings}>
            <Typography variant="h6">$121.00</Typography>
            <ArrowUpwardIcon color="success" />
          </div>
          <Typography variant="body2" className={styles.earningsText}>
            Today Earnings
          </Typography>
        </Grid>
        <Grid item md={2} sm={4}>
          <div className={styles.earnings}>
            <Typography variant="h6">$121.00</Typography>
            <RestartAltRoundedIcon color="primary" />
          </div>
          <Typography variant="body2" className={styles.earningsText}>
            Today Max Earnings
          </Typography>
        </Grid>
        <Grid item md={2} sm={4}>
          <div className={styles.earnings}>
            <Typography variant="h6">$121.00</Typography>
            <ArrowDownwardIcon color="error" />
          </div>
          <Typography variant="body2" className={styles.earningsText}>
            Today Lost
          </Typography>
        </Grid>
      </Grid>

      <TabContext value={tabValue} sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="Twitter" value="twitter" />
            <Tab label="Facebook" value="facebook" />
          </TabList>
        </Box>

        <TabPanel value="twitter">
          <Grid container spacing={2}>
            <Grid item md={3}>
              <NavBar />
            </Grid>
            <Grid item md={9}>
              <Content />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value="facebook"></TabPanel>
      </TabContext>
    </div>
  );
};
export default SocialSharing;
