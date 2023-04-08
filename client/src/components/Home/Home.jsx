/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import { Stack } from "@mui/system";
import { getHomePageStats } from "../../API/Blogs";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SourceIcon from "@mui/icons-material/Source";
import { fetchPaymentStatsAPI } from "../../API/Payments";
import { useAccount } from "wagmi";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router";
import TopReferrals from "./TopReferrals";
import styles from "./Home.module.css";
export default function Home() {
  const { address } = useAccount();
  const [stats, setStats] = useState({});
  const [paymentStats, setPaymentStats] = useState({});
  const fetchData = async () => {
    const data = await getHomePageStats();
    setStats(data);
  };
  const fetchStatsData = async () => {
    const data = await fetchPaymentStatsAPI(address);
    setPaymentStats(data.stats);
  };

  const navigate = useNavigate();
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
                onClick={() => {
                  return window.open(
                    "/spin-wheel",
                    "Windows",
                    "width=650,height=350,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no,addressbar=no"
                  );
                }}
              >
                LAUNCH WHEEL
              </Button>
              <Button
                variant="contained"
                href="/tokens"
                target="_blank"
                className={styles.appBtn}
              >
                Allocation
              </Button>
              <Button
                variant="contained"
                href="/referrals"
                target="_blank"
                className={styles.appBtn}
              >
                Referrals
              </Button>
              <Button
                variant="contained"
                href="/social-sharing"
                target="_blank"
                className={styles.appBtn}
              >
                Social Media
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <TopReferrals />
        </Grid>
      </Grid>
    </Box>
  );
}
