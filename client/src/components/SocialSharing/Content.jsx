import { List, ListItem } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../../config";

const Content = () => {
  const [stats, setStats] = useState();
  const fetchStats = async () => {
    const res = await fetch(`${config.API_ENDPOINT}/social-sharing-stats`, {
      method: "GET",
    });
    const data = await res.json();
    setStats(data);
  };
  useEffect(() => {
    fetchStats();
  }, []);
  const chores = [
    "Lizards are a widespread group of squamate reptiles, with over",
    "ranging across all continents except Antarctica",
    "scrambled it to make a type specimen book",
    "more recently with desktop publishing",
    "discovered the undoubtable source",
    "predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The",
  ];
  return (
    <List>
      {chores.map((chore, index) => {
        return (
          <ListItem key={index}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {chore}
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
export default Content;
