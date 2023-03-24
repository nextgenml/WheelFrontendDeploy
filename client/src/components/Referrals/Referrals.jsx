import { Grid, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useAccount } from "wagmi";
import { saveReferralAPI } from "../../API/Referrals";
import ReferralList from "./ReferralList";
import styles from "./Referrals.module.css";
const Referrals = () => {
  const { address } = useAccount();
  const [referee, setReferee] = useState("");
  const [refresh, setRefresh] = useState(0);
  const onSubmit = async () => {
    const saved = await saveReferralAPI(address, { referee });
    if (saved) setRefresh((prev) => prev + 1);
  };
  return (
    <>
      <Typography variant="h4" className={styles.heading}>
        Enter referee wallet
      </Typography>
      <Grid container spacing={2} className={styles.form}>
        <Grid item md={6} xs={12} display="flex">
          <TextField
            id="outlined-basic"
            label="address*"
            variant="outlined"
            fullWidth
            value={referee}
            onChange={(e) => setReferee(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            onClick={onSubmit}
            sx={{ ml: 4 }}
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
