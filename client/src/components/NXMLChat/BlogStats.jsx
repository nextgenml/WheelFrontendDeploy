/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogContent, Grid, IconButton, Link } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../config";
import moment from "moment";
import { customFetch } from "../../API/index.js";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
function BlogStats({ onClose, blogId, address }) {
  const [stats, setStats] = useState([]);
  const fetchData = async () => {
    const res = await customFetch(
      `${config.API_ENDPOINT}/promoted-blog-stats?walletId=${address}&blogId=${blogId}`
    );
    const { data } = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchData();
  }, [blogId]);
  return (
    <Dialog onClose={() => onClose()} open>
      <DialogTitle>Blog Promotions (Total - {stats.length} )</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ p: 2 }}>
          {stats.map((stat, index) => (
            <>
              <Grid item md={6}>
                <b>{index + 1}.</b> &nbsp;&nbsp;
                {moment(stat.create_date).format("YYYY-MM-DD HH:mm")}
              </Grid>
              <Grid item md={6}>
                <Link href={stat.mediumurl} target="_blank">
                  <IconButton>
                    <DensityMediumIcon />
                  </IconButton>
                </Link>
                <Link href={stat.twitterurl} target="_blank">
                  <IconButton>
                    <TwitterIcon />
                  </IconButton>
                </Link>
                <Link href={stat.facebookurl} target="_blank">
                  <IconButton>
                    <FacebookIcon />
                  </IconButton>
                </Link>
                <Link href={stat.linkedinurl} target="_blank">
                  <IconButton>
                    <LinkedInIcon />
                  </IconButton>
                </Link>
              </Grid>
            </>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default BlogStats;
