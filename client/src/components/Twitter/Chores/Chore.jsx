import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./Chores.module.css";
import { IconButton, Link, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { writeAPICall } from "../../../API";
import config from "../../../config";
import { useAccount } from "wagmi";

function Chore({ chore }) {
  const localCopy = localStorage.getItem(`twitter_chore_${chore.id}_link`);
  const { address } = useAccount();
  const [postLink, setPostLink] = useState(chore.tweet_link || localCopy);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onSubmit = async () => {
    if (
      postLink &&
      (postLink.includes("twitter.com") || postLink.includes("x.com"))
    ) {
    } else {
      alert("Please enter valid twitter post url");
      return;
    }

    setDisableSubmit(true);
    const res = await writeAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/chores/${chore.id}?walletId=${address}`,
      {
        tweet_link: postLink,
      },
      "PUT"
    );
    if (res.ok) {
    }
    setDisableSubmit(false);
  };
  return (
    <Card sx={{ backgroundColor: chore.tweet_link ? "#ccebcc" : "white" }}>
      <CardContent>
        <Typography variant="subtitle1" className={styles.tweetText}>
          {chore.type === "comment" ? (
            <>
              Comment with exact text provided below in this tweet:{" "}
              <Link href={chore.source_tweet_link} target="_blank">
                <b>Open Tweet</b>
              </Link>
            </>
          ) : (
            "You new tweet should contain exact text provided below"
          )}
          <br />
          <b>{chore.content}</b>
          <IconButton
            onClick={() => navigator.clipboard.writeText(chore.content)}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>
        <TextField
          id="outlined-basic"
          label="Post Link*"
          variant="outlined"
          fullWidth
          value={postLink}
          onChange={(e) => {
            setPostLink(e.target.value);
            localStorage.setItem(
              `twitter_chore_${chore.id}_link`,
              e.target.value
            );
          }}
          sx={{ my: 2 }}
        />
        <Button
          variant="contained"
          disabled={disableSubmit}
          component="label"
          onClick={onSubmit}
        >
          SAVE
        </Button>
      </CardContent>
    </Card>
  );
}

export default Chore;
