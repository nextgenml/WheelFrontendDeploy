/* eslint-disable react-hooks/exhaustive-deps */
// import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/system";
import { Link } from "@mui/material";

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
export const getChoreDesc = (chore) => {
  switch (chore.chore_type) {
    case "post":
      return (
        <Typography variant="body1">
          - Post this content exactly like shared below
        </Typography>
      );
    case "like":
      return (
        <Typography variant="body1">
          - Click on the link below to like the{" "}
          <Link href={chore.link_to_post} target={chore.link_to_post}>
            Post
          </Link>
        </Typography>
      );
    case "retweet":
      return (
        <Typography variant="body1">
          - Click on the link below to retweet the{" "}
          <Link href={chore.link_to_post} target={chore.link_to_post}>
            Post
          </Link>
        </Typography>
      );
    case "comment":
      return (
        <Typography variant="body1">
          - Click on the link below to comment on the{" "}
          <Link href={chore.link_to_post} target={chore.link_to_post}>
            Post
          </Link>
        </Typography>
      );
    case "follow":
      return (
        <Typography variant="body1">
          - Follow the user in the link below
        </Typography>
      );
    case "validate":
      return (
        <Typography variant="body1">
          - Validate this work by going to this{" "}
          <Link href={chore.link_to_post} target={chore.link_to_post}>
            Post
          </Link>{" "}
          and compare with what is posted. If valid, mark as correct. Please
          make sure you are validating correctly to get paid
        </Typography>
      );
    default:
      return null;
  }
};
