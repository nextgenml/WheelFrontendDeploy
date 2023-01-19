/* eslint-disable react-hooks/exhaustive-deps */
import { List, ListItem, ImageListItem, ImageList, Grid } from "@mui/material";
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

const Content = ({ tab, walletId, menuOption }) => {
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
    if (chore.chore_type === "post")
      return (
        <Grid container spacing={2}>
          <Grid item md={6}>
            <RichTextEditor onChange={() => {}} initialHtml={chore.content} />
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
    else return <Typography variant="body2">{chore.link_to_post}</Typography>;
  };
  const renderContent = () => {
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
  };
  return chores ? renderContent() : <Loading loading />;
};
export default Content;
