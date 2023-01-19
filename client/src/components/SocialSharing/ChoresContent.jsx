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
            </Grid>
            <Grid item md={6}>
              <ImageList cols={3} rowHeight={164}>
                {(chore.image_urls.split(",") || []).map((url, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={`${config.API_ENDPOINT}/images/${url}?w=164&h=164&fit=crop&auto=format`}
                      alt={"no_image"}
                      loading="lazy"
                    />
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
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
                  </ImageListItem>
                ))}
              </ImageList>
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
        if (suggestions && suggestions[0])
          return (
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
          );
        break;
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
                    <Typography gutterBottom variant="h5" component="div">
                      {chore.media_type} - {chore.chore_type}
                    </Typography>
                    {renderCardBody(chore)}
                  </CardContent>
                  {/* <CardActions>
                  <Button size="small">Download Image</Button>
                  <Button size="small">Like</Button>
                </CardActions> */}
                </Card>
              </ListItem>
            );
          })}
        </List>
      );
    else
      return (
        <div styles={{ textAlign: "center" }}>
          <NewspaperIcon className={styles.blankIcon} />
          <Typography variant="subtitle1">No items present</Typography>
        </div>
      );
  };
  return chores ? renderContent() : <Loading loading />;
};
export default ChoresContent;
