/* eslint-disable react-hooks/exhaustive-deps */
import { List, ListItem } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../../config";
import Loading from "../loading";

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

  const renderContent = () => {
    return (
      <List>
        {console.log("chores", chores)}
        {chores.map((chore, index) => {
          return (
            <ListItem key={index}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {chore.media_type} - {chore.chore_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chore.link_to_post}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Download Image</Button>
                  <Button size="small">Like</Button>
                </CardActions>
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
