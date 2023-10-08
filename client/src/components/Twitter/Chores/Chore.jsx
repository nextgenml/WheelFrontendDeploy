import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./Chores.module.css";
import moment from "moment";
import { IconButton, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

function Chore() {
  const [postLink, setPostLink] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const onSubmit = () => {};
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" className={styles.tweetText}>
          You tweet should contain exact text:
          <br />
          <b>
            {process.env.REACT_APP_MOVIE_TICKETS_TAG_LINE +
              "   " +
              moment().format("YYYY-MM-DD HH:mm:ss")}
          </b>
          <IconButton
            onClick={() =>
              navigator.clipboard.writeText(
                process.env.REACT_APP_MOVIE_TICKETS_TAG_LINE +
                  "   " +
                  moment().format("YYYY-MM-DD HH:mm:ss")
              )
            }
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
          onChange={(e) => setPostLink(e.target.value)}
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
