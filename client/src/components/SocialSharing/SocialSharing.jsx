import { Grid, Typography } from "@mui/material";
import styles from "./SocialSharing.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import NavBar from "./NavBar";
import Content from "./Content";

const SocialSharing = () => {
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
            Today Lost{" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item md={3}>
          <NavBar />
        </Grid>
        <Grid item md={9}>
          <Content />
        </Grid>
      </Grid>
    </div>
  );
};
export default SocialSharing;
