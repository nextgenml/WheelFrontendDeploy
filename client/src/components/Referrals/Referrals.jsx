import { Grid, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useAccount } from "wagmi";
import { saveReferralAPI } from "../../API/Referrals";
import ReferralList from "./ReferralList";
import styles from "./Referrals.module.css";
const Referrals = () => {
  const { address } = useAccount();
  const [twitter, setTwitter] = useState(
    localStorage.getItem(`${address}_referral_twitterLink`)
  );
  const [telegram, setTelegram] = useState(
    localStorage.getItem(`${address}_referral_telegramLink`)
  );
  const [refresh, setRefresh] = useState(0);
  const onSubmit = async () => {
    const saved = await saveReferralAPI(address, { telegram, twitter });
    if (saved) setRefresh((prev) => prev + 1);
  };
  return (
    <>
      <Typography variant="h4" className={styles.heading}>
        Enter referral details
      </Typography>
      <Grid container spacing={2} className={styles.form}>
        <Grid item md={6} xs={12} display="flex">
          <TextField
            id="outlined-basic"
            label="Twitter Profile Link*"
            variant="outlined"
            placeholder="eg: https://twitter.com/nextgen_ml"
            fullWidth
            value={twitter}
            onChange={(e) => {
              setTwitter(e.target.value);
              localStorage.setItem(
                `${address}_referral_twitterLink`,
                e.target.value
              );
            }}
            sx={{ mr: 2 }}
          />
        </Grid>
        <Grid item md={4} xs={9}>
          <TextField
            id="outlined-basic"
            label="Telegram @*"
            variant="outlined"
            fullWidth
            placeholder="eg: @nexgen_ml"
            value={telegram}
            onChange={(e) => {
              setTelegram(e.target.value);
              localStorage.setItem(
                `${address}_referral_telegramLink`,
                e.target.value
              );
            }}
          />
        </Grid>
        <Grid item md={2} xs={3}>
          <Button
            variant="contained"
            component="label"
            onClick={onSubmit}
            disabled={!(twitter && telegram)}
          >
            Refer
          </Button>
        </Grid>
      </Grid>
      <ReferralList address={address} count={refresh} />
    </>
  );
};
export default Referrals;
