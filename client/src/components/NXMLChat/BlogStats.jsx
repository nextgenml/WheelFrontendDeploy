/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Grid, Link } from "@mui/material";
import { useEffect, useState } from "react";
import config from "../../config";
import moment from "moment";

function BlogStats({ onClose, blogId, address }) {
  const [stats, setStats] = useState([]);
  const fetchData = async () => {
    const res = await fetch(
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
      <DialogTitle>Blog Stats</DialogTitle>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {stats.map((stat) => (
          <>
            <Grid item md={6}>
              <Link href={stat.link} target="_blank">
                {stat.link}
              </Link>
            </Grid>
            <Grid item md={6}>
              {moment(stat.create_date).format("YYYY-MM-DD HH:mm")}
            </Grid>
          </>
        ))}
      </Grid>
    </Dialog>
  );
}

export default BlogStats;
