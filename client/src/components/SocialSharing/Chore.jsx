/* eslint-disable react-hooks/exhaustive-deps */
import {
  ListItem,
  ImageListItem,
  ImageList,
  Grid,
  Link,
  TextField,
  FormLabel,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useState } from "react";
import config from "../../config";
// import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { copyImageToClipboard } from "copy-image-clipboard";
import styles from "./SocialSharing.module.css";
// import { convert } from "html-to-text";
import { Box } from "@mui/system";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getChoreDesc, getHeading } from "./Util";
import { getContentFromChatGptAPI } from "../../API/SocialSharing";
import { similarity } from "../../Utils/index";

const Chore = ({ chore, index, markAsDone, validateChore }) => {
  const [comment, setComment] = useState({ loading: false, data: "" });
  const [commentLink, setCommentLink] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [blueScore, setBlueScore] = useState();
  const generateComment = async (chore) => {
    setComment((prev) => ({
      ...prev,
      loading: true,
    }));

    const res = await getContentFromChatGptAPI({
      msg: `rewrite the next sentence in 256 characters. ${chore.content}`,
    });
    if (res) {
      setComment((prev) => ({
        loading: false,
        data: res.result,
      }));
    } else {
      setComment((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  const calculateBlueScore = () => {
    const score = similarity(chore.content, pastedContent);
    setBlueScore(`${score * 100}%`);
  };
  const renderCardBody = (chore) => {
    switch (chore.chore_type) {
      case "post":
        return (
          <Grid container spacing={2}>
            <Grid item md={6}>
              {/* <RichTextEditor
                onChange={() => {}}
                initialHtml={chore.content}
                readOnly
              /> */}
              <TextField
                multiline
                fullWidth
                rows={4}
                disabled
                value={chore.content}
              />
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(chore.content);
                }}
              >
                Copy Text
              </Button>
            </Grid>
            <Grid item md={6}>
              {chore.image_urls && (
                <ImageList cols={3} rowHeight={164}>
                  {(chore.image_urls.split(",") || []).map((url, index) => (
                    <div className={styles.imageItem}>
                      <ImageListItem key={index}>
                        <img
                          src={`${config.API_ENDPOINT}/images/${url}?w=164&h=164&fit=crop&auto=format`}
                          alt={"no_image"}
                          loading="lazy"
                        />
                      </ImageListItem>
                      <Button
                        variant="outlined"
                        sx={{ mt: 5 }}
                        onClick={() => {
                          copyImageToClipboard(
                            `${config.API_ENDPOINT}/images/${url}?w=164&h=164&fit=crop&auto=format`
                          )
                            .then(() => {
                              console.log("Image Copied");
                            })
                            .catch((e) => {
                              console.log("Error: ", e.message);
                            });
                        }}
                      >
                        Copy Image
                      </Button>
                    </div>
                  ))}
                </ImageList>
              )}
            </Grid>
          </Grid>
        );
      case "like":
      case "retweet":
        return (
          <Link href={chore.link_to_post} target={chore.link_to_post}>
            Link to Post
          </Link>
        );
      case "comment":
        return (
          <div>
            <Grid container spacing={2}>
              <Grid item md={6}>
                {/* <RichTextEditor
                    onChange={() => {}}
                    initialHtml={suggestions[0]}
                    readOnly
                  /> */}
                <TextField
                  multiline
                  fullWidth
                  rows={4}
                  disabled
                  placeholder="Click on Generate button below to populate comment"
                  value={comment.data || ""}
                />

                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => generateComment(chore)}
                  disabled={comment.loading}
                >
                  {comment.loading ? "Generating....." : "Generate Comment"}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, ml: 2 }}
                  onClick={() => {
                    navigator.clipboard.writeText(comment.data || "");
                  }}
                >
                  Copy Text
                </Button>
              </Grid>
              <Grid item md={6}>
                <FormLabel sx={{ mb: 2 }}>
                  Paste comment post link after commenting and mark as done
                </FormLabel>
                <TextField
                  fullWidth
                  placeholder="Eg: https://twitter.com/PuredlaB/status/1638250676009701377"
                  value={commentLink}
                  onChange={(e) => setCommentLink(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box sx={{ pt: 2 }}>
              <Link href={chore.link_to_post} target={chore.link_to_post}>
                Link to Post
              </Link>
            </Box>
          </div>
        );
      case "follow":
        return (
          <Link href={chore.follow_link} target={chore.follow_link}>
            Follow this user
          </Link>
        );
      case "validate":
        return (
          <div>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextField
                  multiline
                  fullWidth
                  rows={4}
                  disabled
                  value={chore.content}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  multiline
                  fullWidth
                  placeholder="Paste content here"
                  rows={4}
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                />
                <FormLabel sx={{ mb: 2 }}>
                  Paste comment post in the provided link and compare the
                  similarity.
                </FormLabel>
                <Box display={"flex"} alignItems={"center"}>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, mr: 2 }}
                    onClick={calculateBlueScore}
                    disabled={!pastedContent}
                  >
                    Compare Similarity Score
                  </Button>
                  <Typography variant="h6">{blueScore}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ pt: 2 }}>
              <Link href={chore.link_to_post} target={chore.link_to_post}>
                Link to Post
              </Link>
            </Box>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ListItem key={index}>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Box sx={{ mb: 2 }} display={"flex"} alignItems="center">
            {getHeading(chore.media_type)}
            <Box sx={{ p: 2 }}>{getChoreDesc(chore)}</Box>
            {chore.chore_type === "validate" ? (
              <Box sx={{ ml: "auto", display: "flex" }}>
                <Button
                  variant="outlined"
                  sx={{ mr: 1 }}
                  disabled={!blueScore || chore.completed_by_user !== 0}
                  onClick={() =>
                    validateChore(chore.id, "reject", chore.ref_chore_id)
                  }
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  disabled={!blueScore || chore.completed_by_user !== 0}
                  onClick={() =>
                    validateChore(chore.id, "approve", chore.ref_chore_id)
                  }
                >
                  Approve
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                sx={{ ml: "auto" }}
                disabled={
                  chore.completed_by_user === 1 ||
                  (chore.chore_type === "comment" && (!comment || !commentLink))
                }
                onClick={() => markAsDone(chore.id, comment.data, commentLink)}
              >
                {chore.completed_by_user ? "Completed" : "Mark as done"}
              </Button>
            )}
            {chore.completed_by_user === 1 && (
              <CheckCircleOutlineIcon sx={{ ml: 1 }} color="success" />
            )}
          </Box>

          {renderCardBody(chore)}
        </CardContent>
      </Card>
    </ListItem>
  );
};
export default Chore;
