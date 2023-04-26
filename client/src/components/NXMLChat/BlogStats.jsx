/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Grid, Link } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../config";
import moment from "moment";
import { customFetch } from "../../API/index.js";

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
      <Grid container spacing={2} sx={{ p: 2 }}>
        {stats.map((stat, index) => (
          <>
            <Grid item md={6}>
              <b>{index + 1}.</b> &nbsp;&nbsp;
              {moment(stat.create_date).format("YYYY-MM-DD HH:mm")}
            </Grid>
            <Grid item md={6}>
              <Link href={stat.mediumurl} target="_blank">
                {stat.mediumurl}
              </Link>
            </Grid>
          </>
        ))}
      </Grid>
    </Dialog>
  );
}

export default BlogStats;
