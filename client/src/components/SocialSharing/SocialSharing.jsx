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
          <Typography variant="h6">$121.00</Typography>
        </Grid>
        <Grid item md={2} sm={4}>
          <Typography variant="h6">$121.00</Typography>
          <ArrowUpwardIcon color="success" />
        </Grid>
        <Grid item md={2} sm={4}>
          <Typography variant="h6">$121.00</Typography>
          <RestartAltRoundedIcon color="primary" />
        </Grid>
        <Grid item md={2} sm={4}>
          <Typography variant="h6">$121.00</Typography>
          <ArrowDownwardIcon color="error" />
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
