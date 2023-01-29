/* eslint-disable react-hooks/exhaustive-deps */
import {
  List,
  ListItem,
  ImageListItem,
  ImageList,
  Grid,
  Link,
} from "@mui/material";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../../config";
import Loading from "../loading";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { copyImageToClipboard } from "copy-image-clipboard";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import styles from "./SocialSharing.module.css";
import { convert } from "html-to-text";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/system";
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
  const fetchStats = async () => {
    const res = await fetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-chores?mediaType=${tab}&walletId=${walletId}&type=${menuOption.toLowerCase()}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setChores(data.data);
  };
  useEffect(() => {
    fetchStats();
  }, [menuOption]);

  const renderCardBody = (chore) => {
    switch (chore.chore_type) {
      case "post":
        return (
          <Grid container spacing={2}>
            <Grid item md={6}>
              <RichTextEditor
                onChange={() => {}}
                initialHtml={chore.content}
                readOnly
              />
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(convert(chore.content));
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
        const suggestions = (chore.comment_suggestions || "").split("||");
        return (
          <div>
            {suggestions[0] && (
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <RichTextEditor
                    onChange={() => {}}
                    initialHtml={suggestions[0]}
                    readOnly
                  />
                </Grid>
                {suggestions[1] && (
                  <Grid item md={6}>
                    <RichTextEditor
                      onChange={() => {}}
                      initialHtml={suggestions[1]}
                      readOnly
                    />
                  </Grid>
                )}
              </Grid>
            )}
            <Box sx={{ pt: 1 }}>
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
        <List>
          {chores.map((chore, index) => {
            return (
              <ListItem key={index}>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }} display={"flex"} alignItems="center">
                      {getHeading(chore.media_type)}
                      {getChoreDesc(chore.chore_type)}
                    </Box>

                    {renderCardBody(chore)}
                  </CardContent>
                </Card>
              </ListItem>
            );
          })}
        </List>
      );
    else
      return (
        <div style={{ textAlign: "center" }}>
          <NewspaperIcon className={styles.blankIcon} />
          <Typography variant="subtitle1">No chores present</Typography>
        </div>
      );
  };
  return chores ? renderContent() : <Loading loading />;
};
export default ChoresContent;
