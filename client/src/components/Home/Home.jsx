import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Link, Chip } from "@mui/material";
import homeimg from "./assets/home.png";
import { Stack } from "@mui/system";
import { getHomePageStats } from "../../API/Blogs";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SourceIcon from "@mui/icons-material/Source";

export default function Home() {
  const [stats, setStats] = useState({});
  const fetchData = async () => {
    const data = await getHomePageStats();
    setStats(data);
  };
  useEffect(() => {
    fetchData();
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
      <Grid container>
        <Grid item xs={12} sm={12}>
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
            of data in a decentralized world through our advanced blockchain AI
            solutions. Our platform streamlines data automation, unlocking new
            revenue streams and providing a competitive edge in the rapidly
            evolving digital landscape. From creating new products and services
            to improving existing offerings, our solutions will drive growth and
            innovation. Join us in the journey to secure control and value from
            your data in the decentralized era. 
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <a
              href="#buy-nextgen"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button
                sx={{
                  bgcolor: "#2E87E5",
                  
                  my: 2,
                  fontFamily: "Audiowide",
                  borderRadius: "10px",
                  "&:hover": {
                    bgcolor: "#2E87E5b1",
                  },
                }}
              >
                BUY NEXGEN
              </Button>
            </a> */}

            <Button
              variant="contained"
              sx={{
                my: 2,
                fontFamily: "Audiowide",
                borderRadius: "10px",
              }}
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
              sx={{
                my: 2,
                fontFamily: "Audiowide",
                borderRadius: "10px",
              }}
            >
              Allocation
            </Button>
            <Button
              variant="contained"
              href="/referrals"
              target="_blank"
              sx={{
                my: 2,
                fontFamily: "Audiowide",
                borderRadius: "10px",
              }}
            >
              Referrals
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
