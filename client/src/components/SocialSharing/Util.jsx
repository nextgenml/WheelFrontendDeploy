/* eslint-disable react-hooks/exhaustive-deps */
// import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/system";

export const getHeading = (mediaType) => {
  switch (mediaType) {
    case "twitter":
      return (
        <Box display={"flex"} alignItems="center" sx={{ mr: 2 }}>
          <TwitterIcon sx={{ color: "#00acee", mr: 1 }} />
          <Typography variant="h5">Twitter</Typography>
        </Box>
      );
    default:
      return null;
  }
};
export const getChoreDesc = (mediaType) => {
  switch (mediaType) {
    case "post":
      return (
        <Typography variant="body1">
          - Post this content exactly like shared below
        </Typography>
      );
    case "like":
      return (
        <Typography variant="body1">
          - Click on the link below to like the post
        </Typography>
      );
    case "retweet":
      return (
        <Typography variant="body1">
          - Click on the link below to retweet the post
        </Typography>
      );
    case "comment":
      return (
        <Typography variant="body1">
          - Click on the link below to comment on the post
        </Typography>
      );
    case "follow":
      return (
        <Typography variant="body1">
          - Follow the user in the link below
        </Typography>
      );
    default:
      return null;
  }
};
