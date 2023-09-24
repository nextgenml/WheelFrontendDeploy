/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  IconButton,
} from "@mui/material";
import styles from "./MovieTickets.module.css";
import { useState } from "react";
import config from "../../config.js";
import { customFetch } from "../../API";
import PostLink from "./PostLink";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RedeemIcon from "@mui/icons-material/Redeem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const POST_LINK_KEY = "movie_tickets_post_link";
const NewUserChoreForm = ({
  pastLinks,
  getPastLinks,
  referralReward,
  holder,
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [postLink, setPostLink] = useState(
    localStorage.getItem(POST_LINK_KEY) || undefined
  );
  const onFormDataChange = (newValue, key) => {
    localStorage.setItem(key, newValue);
    setPostLink(newValue);
  };

  const onSubmit = async () => {
    if (!postLink || !postLink.includes("twitter.com")) {
      alert("Please enter valid twitter post url");
      return;
    }

    setDisableSubmit(true);
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/chores`,
      {
        method: "POST",
        body: JSON.stringify({
          twitter_link: postLink,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      getPastLinks();
      setPostLink("");
      localStorage.removeItem(POST_LINK_KEY);
    } else {
      const { message } = await res.json();
      alert(message || "Something went wrong. Please try again after sometime");
    }
    setDisableSubmit(false);
  };

  const renderChoreForm = () => {
    return (
      <Card elevation={1} sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2} className={styles.form}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" className={styles.subHeading}>
              <b>
                Completed ({pastLinks.completed} of {pastLinks.total})
              </b>
            </Typography>
            <Typography variant="subtitle1">
              Make {pastLinks.total} tweets, post them on X and avail free movie
              ticket.
            </Typography>
            <Typography variant="subtitle1" className={styles.tweetText}>
              You tweet should contain exact text:
              <br />
              <b>{process.env.REACT_APP_MOVIE_TICKETS_TAG_LINE}</b>
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(
                    process.env.REACT_APP_MOVIE_TICKETS_TAG_LINE
                  )
                }
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Grid>

          <Grid item md={12} xs={12}>
            <Typography
              variant="h6"
              sx={{ mt: 3 }}
              className={styles.subHeading}
            >
              <b>Chores</b>
            </Typography>
          </Grid>

          {pastLinks.data &&
            pastLinks.data.map((x, i) => {
              return <PostLink row={x} onSave={getPastLinks} key={i} />;
            })}

          {pastLinks.takeNewPost && (
            <>
              <Grid item md={2} xs={12}>
                <b>New Post</b>
              </Grid>
              <Grid item md={8} xs={9}>
                <TextField
                  id="outlined-basic"
                  label="Post Link*"
                  variant="outlined"
                  fullWidth
                  value={postLink}
                  onChange={(e) =>
                    onFormDataChange(e.target.value, POST_LINK_KEY)
                  }
                />
              </Grid>

              <Grid item md={2} xs={3}>
                <Button
                  variant="contained"
                  disabled={disableSubmit}
                  component="label"
                  onClick={onSubmit}
                >
                  SAVE
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Card>
    );
  };
  const renderNMLMessage = () => {
    return (
      <Card elevation={1} sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" sx={{ color: "red" }}>
          You need to have minimum {pastLinks.minNMlBalance} tokens in your
          account to avail free movie tickets
        </Typography>
        <Button
          href="https://app.uniswap.org/swap?outputCurrency=0x3858dad8a5b3364be56de0566ab59e3d656c51f6&chain=mainnet"
          target="_blank"
          variant="contained"
          sx={{ mt: 1 }}
        >
          Buy Now
        </Button>
      </Card>
    );
  };
  return (
    <div className={styles.main}>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Card elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" className={styles.earningsText}>
              Points Accumulated
            </Typography>
            <Box display="flex" justifyContent={"space-around"} sx={{ mt: 2 }}>
              <Box display="flex" alignItems={"center"}>
                <Typography variant="h6">
                  {pastLinks.data
                    ? pastLinks.data.length * pastLinks.choreReward
                    : 0}
                </Typography>
                <AccountBalanceWalletIcon
                  color="success"
                  fontSize="small"
                  sx={{ ml: 0.5 }}
                />
              </Box>
              <Box display="flex" alignItems={"center"}>
                <Typography variant="h6">{referralReward}</Typography>
                <RedeemIcon color="warning" fontSize="small" sx={{ ml: 0.5 }} />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Referral Link
                </Typography>
                <IconButton>
                  <ContentCopyIcon
                    fontSize="small"
                    color="primary"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${config.API_ENDPOINT}/own-a-memory?inviteCode=${holder.invite_code}`
                      )
                    }
                  />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" justifyContent={"space-around"}>
              <Typography variant="caption" color="var(--bs-indigo)">
                Chores
              </Typography>
              <Typography variant="caption" color="var(--bs-indigo)">
                Referrals
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {pastLinks && pastLinks.enableChores && renderChoreForm()}
      {!pastLinks.isNmlHolder &&
        parseInt(pastLinks.flowType) !== 1 &&
        renderNMLMessage()}
    </div>
  );
};
export default NewUserChoreForm;
