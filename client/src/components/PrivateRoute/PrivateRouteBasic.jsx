import { Box, Card, Link, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

const PrivateRouteBasic = ({ component }) => {
  const { isConnected } = useAccount();
  if (isConnected) return <>{component}</>;
  else
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", p: 2 }}
        elevation={2}
      >
        <Card sx={{ maxWidth: 500 }}>
          <CardMedia
            sx={{ height: 350 }}
            image="/images/chores.jpg"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Welcome to Portfolio Inbox
            </Typography>
            <Typography variant="body2">
              Please connect your wallet using metamask. In case you are facing
              issues while connecting to metamask using mobile, please close all
              apps from background and retry
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
};

export default PrivateRouteBasic;
