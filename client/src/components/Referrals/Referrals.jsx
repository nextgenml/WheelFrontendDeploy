import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useAccount } from "wagmi";
import { saveReferralAPI } from "../../API/Referrals";
import ReferralList from "./ReferralList";
import styles from "./Referrals.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import config from "../../config";
import { useSearchParams } from "react-router-dom";
const Referrals = () => {
  const { address } = useAccount();
  const [twitter, setTwitter] = useState(
    localStorage.getItem(`${address}_referral_twitterLink`)
  );
  const [telegram, setTelegram] = useState(
    localStorage.getItem(`${address}_referral_telegramLink`)
  );
  const [refresh, setRefresh] = useState(0);
  const [inviteLink, setInviteLink] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [searchParams, _] = useSearchParams();
  const searchWalletId = searchParams.get("walletId");
  const finalWallet =
    address === config.ADMIN_WALLET_1 ? searchWalletId || address : address;

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
      <Box className={styles.inviteBox}>
        <Typography variant="h6">
          Or Copy InviteLink
          <TextField
            disabled
            value={`${config.API_ENDPOINT}/${inviteLink}`}
            sx={{ width: "300px", ml: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button>
                    <ContentCopyIcon
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${config.API_ENDPOINT}/${inviteLink}`
                        )
                      }
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Typography>
      </Box>
      <ReferralList
        address={address}
        finalWallet={finalWallet}
        count={refresh}
        setInvite={(x) => setInviteLink(x)}
      />
    </>
  );
};
export default Referrals;
