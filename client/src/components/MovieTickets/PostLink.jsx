/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, TextField, Button, InputAdornment } from "@mui/material";
import { useState } from "react";
import config from "../../config.js";
import { customFetch } from "../../API";
import moment from "moment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PostLink = ({ row, onSave }) => {
  const [postLink, setPostLink] = useState(row.twitter_link);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onSubmit = async () => {
    if (!postLink || !postLink.includes("twitter.com")) {
      alert("Please enter valid twitter post url");
      return;
    }

    setDisableSubmit(true);
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/chores/${row.id}?walletId=${row.wallet_id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          twitter_link: postLink,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      alert("Updated successfully");
      onSave();
    } else {
      const { message } = await res.json();
      alert(message || "Something went wrong. Please try again after sometime");
    }
    setDisableSubmit(false);
  };
  return (
    <>
      <Grid item md={2} xs={2}>
        {moment(row.created_at).format("YYYY-MM-DD")}
      </Grid>
      <Grid item md={8} xs={8}>
        <TextField
          id="outlined-basic"
          label="Post Link*"
          variant="outlined"
          fullWidth
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CheckCircleOutlineIcon sx={{ ml: 1 }} color="success" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item md={2} xs={2}>
        <Button
          variant="contained"
          disabled={!postLink || disableSubmit}
          component="label"
          onClick={onSubmit}
        >
          SAVE
        </Button>
      </Grid>
    </>
  );
};
export default PostLink;
