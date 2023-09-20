/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Box, Grid, Link } from "@mui/material";
import styles from "./MovieTickets.module.css";
import NewUserChoreForm from "./NewUserChoreForm";
import NextMovieForm from "./NextMovieForm";
import { useEffect, useState } from "react";
import { customFetch, getAPICall, writeAPICall } from "../../API";
import config from "../../config";
import { useSearchParams } from "react-router-dom";
import PastMovies from "./PastMovies";

const MovieTickets = () => {
  const [meta, setMeta] = useState({});
  const [referralReward, setReferralReward] = useState(0);
  const [searchParams, _] = useSearchParams();
  const [holder, setHolder] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    getMeta();
    getReferralReward();
    if (searchParams.get("inviteCode") && !searchParams.get("viewAs")) {
      saveReferral();
    }
    fetchHolder();
  }, []);
  const fetchHolder = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/holders/details`,
      true
    );
    setHolder(data);
  };
  const getMeta = async () => {
    setCount((x) => x + 1);
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/chores?viewAs=${
        searchParams.get("viewAs") || ""
      }`
    );
    if (res.ok) {
      const data = await res.json();
      setMeta(data);
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };
  const getReferralReward = async () => {
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/referrals?viewAs=${
        searchParams.get("viewAs") || ""
      }`
    );
    if (res.ok) {
      const data = await res.json();
      setReferralReward(data.rewards);
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };
  const saveReferral = async () => {
    await writeAPICall(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/referrals`,
      { inviteCode: searchParams.get("inviteCode") },
      "POST",
      true
    );
  };

  if (meta && meta.is_blocked)
    return (
      <Box>
        <Typography variant="h4" className={styles.heading}>
          Your Access is blocked by admin.
        </Typography>
      </Box>
    );
  return (
    <Box>
      <Typography variant="h4" className={styles.heading}>
        Own a memory
      </Typography>
      <Box className={styles.linkBox}>
        <Link
          href="https://medium.com/@krisparson6/own-a-memory-a-new-way-to-watch-free-movies-and-grow-your-dreams-e6aee1328148"
          target="_blank"
        >
          How to Use?
        </Link>
      </Box>

      <Grid container>
        <Grid item md={6}>
          <NewUserChoreForm
            pastLinks={meta}
            getPastLinks={getMeta}
            referralReward={referralReward}
            holder={holder}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <NextMovieForm meta={meta} getMeta={getMeta} />
        </Grid>
        <Grid item md={12} sx={{ width: "100%" }}>
          <PastMovies count={count} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default MovieTickets;
