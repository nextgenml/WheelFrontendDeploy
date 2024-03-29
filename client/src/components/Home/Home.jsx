/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import { getHomePageStats } from "../../API/Blogs";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SourceIcon from "@mui/icons-material/Source";
import { fetchPaymentStatsAPI } from "../../API/Payments";
import { useAccount } from "wagmi";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import TopTweets from "./TopTweets";
export default function Home() {
  const { address } = useAccount();
  const [stats, setStats] = useState({});
  const [paymentStats, setPaymentStats] = useState({});
  const navigate = useNavigate();
  const fetchData = async () => {
    const data = await getHomePageStats();
    setStats(data);
  };
  const fetchStatsData = async () => {
    const data = await fetchPaymentStatsAPI(address);
    setPaymentStats(data.stats);
  };

  useEffect(() => {
    fetchData();
    fetchStatsData();
  }, []);
  return (
    <Box
      py={15}
      sx={{
        backgroundRepeat: "no-repeat",
        backgroundSize: { xs: "100% 100%", sm: "30% 90%" },
        backgroundPosition: "center right",
      }}
    >
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Grid item xs={12} sm={12}>
            <Chip
              sx={{ fontSize: "16px", mr: 3 }}
              label={`Total Earned: ${
                paymentStats.blog + paymentStats.referral || 0
              }`}
              variant="outlined"
              icon={<LocalAtmIcon sx={{ color: "#fb9c01 !important" }} />}
              onClick={() => navigate("/payments")}
            />
            <Chip
              sx={{ fontSize: "16px", mr: 3 }}
              label={`Earned in Blogs: ${paymentStats.blog || 0}`}
              variant="outlined"
              icon={<LocalAtmIcon sx={{ color: "#fb9c01 !important" }} />}
              onClick={() => navigate("/payments")}
            />
            <Chip
              sx={{ fontSize: "16px", mr: 3 }}
              label={`Earned in Referrals: ${paymentStats.referral || 0}`}
              variant="outlined"
              icon={<LocalAtmIcon sx={{ color: "#fb9c01 !important" }} />}
              onClick={() => navigate("/payments")}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography
              color="#3B7AAA"
              sx={{
                fontFamily: "Audiowide",
              }}
              variant="h3"
            >
              NEXGEN ML TOKEN
            </Typography>
            <Typography
              sx={{
                textDecoration: "none",
                textAlign: "justify",
              }}
              fontWeight="bold"
              my={3}
            >
              NEXGEN ML empowers communities with the ownership and monetization
              of data in a decentralized world through our advanced blockchain
              AI solutions. Our platform streamlines data automation, unlocking
              new revenue streams and providing a competitive edge in the
              rapidly evolving digital landscape. From creating new products and
              services to improving existing offerings, our solutions will drive
              growth and innovation. Join us in the journey to secure control
              and value from your data in the decentralized era. 
            </Typography>

            <Box display={"flex"} sx={{ mb: 2 }}>
              <Chip
                sx={{ fontSize: "16px", mr: 3 }}
                label={`Total Bloggers: ${stats.totalBloggers}`}
                icon={<PeopleAltIcon sx={{ color: "#fb9c01 !important" }} />}
                variant="outlined"
              />
              <Chip
                sx={{ fontSize: "16px" }}
                label={`Total Blogs: ${stats.totalBlogs}`}
                icon={<SourceIcon sx={{ color: "#fb9c01 !important" }} />}
                variant="outlined"
              />
            </Box>
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                className={styles.appBtn}
                onClick={() => navigate("spin-wheel")}
              >
                LAUNCH WHEEL
              </Button>
              <Button
                variant="contained"
                target="_blank"
                className={styles.appBtn}
                onClick={() => navigate("/tokens")}
              >
                Allocation
              </Button>
              <Button
                variant="contained"
                target="_blank"
                className={styles.appBtn}
                onClick={() => navigate("/referrals")}
              >
                Referrals
              </Button>
            </Box>
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                target="_blank"
                className={styles.appBtn}
                onClick={() => navigate("/social-sharing")}
              >
                Work Area
              </Button>
              <Button
                variant="contained"
                target="_blank"
                className={styles.appBtn}
                onClick={() => navigate("/payments")}
              >
                Earnings
              </Button>
              <Button
                variant="contained"
                target="_blank"
                className={styles.appBtn}
                onClick={() => navigate("/own-a-memory")}
              >
                Own a Memory
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <TopTweets />
        </Grid>
      </Grid>
    </Box>
  );
}
