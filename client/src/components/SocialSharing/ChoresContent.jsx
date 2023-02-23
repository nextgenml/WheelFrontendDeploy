/* eslint-disable react-hooks/exhaustive-deps */
import {
  List,
  ListItem,
  ImageListItem,
  ImageList,
  Grid,
  Link,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../../config";
import Loading from "../loading";
// import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { copyImageToClipboard } from "copy-image-clipboard";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import styles from "./SocialSharing.module.css";
// import { convert } from "html-to-text";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/system";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const getHeading = (mediaType) => {
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
const getChoreDesc = (mediaType) => {
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
const ChoresContent = ({ tab, walletId, menuOption }) => {
  const [chores, setChores] = useState();
  const [filter, setFilter] = useState("todo");
  const [commentById, setCommentById] = useState({});
  const fetchStats = async () => {
    const res = await fetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-chores?mediaType=${tab}&walletId=${walletId}&type=${menuOption.toLowerCase()}&filter=${filter}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setChores(data.data);
  };
  useEffect(() => {
    fetchStats();
  }, [menuOption, filter]);

  const markAsDone = async (choreId) => {
    const res = await fetch(
      `${config.API_ENDPOINT}/mark-chore-as-done?walletId=${walletId}&choreId=${choreId}`,
      {
        method: "POST",
      }
    );

    if (res.ok) {
      const chore = chores.filter((c) => c.id === choreId)[0];
      chore.completed_by_user = 1;
      setChores([...chores]);
    } else alert("Something went wrong. Please try later");
  };
  const generateComment = async (chore) => {
    setCommentById((prev) => ({
      ...prev,
      [chore.id]: {
        ...prev[chore.id],
        loading: true,
      },
    }));

    try {
      const res = await fetch(`${config.CHAT_BOT_URL}/collections`, {
        method: "POST",
        body: JSON.stringify({
          msg: `rewrite the next sentence in 256 characters. ${chore.content}`,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCommentById((prev) => ({
          ...prev,
          [chore.id]: {
            loading: false,
            data: data.result,
          },
        }));
      } else {
        alert("Something went wrong. Please try again after sometime");
      }
    } catch (error) {
      alert("Something went wrong. Please try again after sometime");
    }
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
                  value={commentById[chore.id]?.data || ""}
                />
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => generateComment(chore)}
                  disabled={commentById[chore.id]?.loading}
                >
                  {commentById[chore.id]?.loading
                    ? "Generating....."
                    : "Generate Comment"}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, ml: 2 }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      commentById[chore.id]?.data || ""
                    );
                  }}
                >
                  Copy Text
                </Button>
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
      default:
        return null;
    }
  };
  const renderContent = () => {
    if (chores.length)
      return (
        <>
          <List>
            {chores.map((chore, index) => {
              return (
                <ListItem key={index}>
                  <Card sx={{ width: "100%" }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }} display={"flex"} alignItems="center">
                        {getHeading(chore.media_type)}
                        {getChoreDesc(chore.chore_type)}
                        <Button
                          variant="outlined"
                          sx={{ ml: "auto" }}
                          disabled={chore.completed_by_user === 1}
                          onClick={() => markAsDone(chore.id)}
                        >
                          {chore.completed_by_user
                            ? "Completed"
                            : "Mark as done"}
                        </Button>
                        {chore.completed_by_user === 1 && (
                          <CheckCircleOutlineIcon
                            sx={{ ml: 1 }}
                            color="success"
                          />
                        )}
                      </Box>

                      {renderCardBody(chore)}
                    </CardContent>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        </>
      );
    else
      return (
        <div style={{ textAlign: "center" }}>
          <NewspaperIcon className={styles.blankIcon} />
          <Typography variant="subtitle1">No chores present</Typography>
        </div>
      );
  };
  return chores ? (
    <>
      <FormControl sx={{ ml: 2 }}>
        <FormLabel>Chores</FormLabel>
        <RadioGroup
          row
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <FormControlLabel value="todo" control={<Radio />} label="To Do" />
          <FormControlLabel
            value="completed"
            control={<Radio />}
            label="Completed"
          />
          <FormControlLabel value="all" control={<Radio />} label="All" />
        </RadioGroup>
      </FormControl>
      {renderContent()}
    </>
  ) : (
    <Loading loading />
  );
};
export default ChoresContent;
