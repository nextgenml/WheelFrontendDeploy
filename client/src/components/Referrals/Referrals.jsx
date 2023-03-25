import { Grid, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useAccount } from "wagmi";
import { saveReferralAPI } from "../../API/Referrals";
import ReferralList from "./ReferralList";
import styles from "./Referrals.module.css";
const Referrals = () => {
  const { address } = useAccount();
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
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
        <Grid item md={10} xs={12} display="flex">
          <TextField
            id="outlined-basic"
            label="Twitter @*"
            variant="outlined"
            fullWidth
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            id="outlined-basic"
            label="Telegram @*"
            variant="outlined"
            fullWidth
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            onClick={onSubmit}
            sx={{ ml: 4 }}
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
