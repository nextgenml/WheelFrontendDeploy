import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  List,
  ListItem,
  TextField,
  Grid,
  Typography,
  Box,
  Link,
} from "@mui/material";
import config from "../../config";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
const Instructions = ({ generatedAlias, address }) => {
  const [open, setOpen] = React.useState(false);
  const [alias, setAlias] = React.useState(generatedAlias || "");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [randomNumber, setRandomNumber] = React.useState(0);

  React.useEffect(() => {
    setAlias(generatedAlias);
    // setRandomNumber(Math.floor(Math.random() * 10));
  }, [generatedAlias]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/update-alias?walletId=${address}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newAlias: `${alias}` }),
      }
    );
    if (res.ok) {
      alert("Alias updated successfully");
      handleClose();
      setAlias(`${alias}`);
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Instructions
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Instructions</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <Typography variant="h6">MetaMask setup.</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                1. Download MetaMask on your phone or Laptop. -&nbsp;&nbsp;
                <Link
                  href={"https://youtu.be/-HTubEJ61zU"}
                  target="_blank"
                  underline="none"
                >
                  Video &nbsp;
                  <OpenInNewIcon fontSize="small" />
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                2. Please ensure you have a brand new wallet as this will be
                used as your login
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                3. Request funny ETH from a faucet for testing- steps
                &nbsp;&nbsp;
              </Typography>
              <Link
                // add faucet testing pdf
                href={"/faucet_testing.pdf"}
                target="_blank"
                underline="none"
              >
                Doc &nbsp;
                <OpenInNewIcon fontSize="small" />
              </Link>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                4. Click on Connect button on the web
              </Typography>
            </ListItem>
          </List>

          <List>
            <ListItem>
              <Typography variant="h6">Twitter setup.</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                1. create a Twitter account
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                2. Update your Twitter @ handle to what is mentioned in web page
              </Typography>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Typography variant="h6">Click on assigned chores</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                1. You may be provided about 50 - 100 chores
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                2. Every chore is a combination of clicks
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                3. Complete the assigned chores
              </Typography>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Typography variant="h6">Review</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                1. Please let us know if the user interface was easy to use
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                2. Will you use the tool for SEO campaigns or event promotions
              </Typography>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Typography variant="h6">Timeline</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">13th Feb to 20th Feb</Typography>
            </ListItem>
          </List>
          <List>
            <ListItem sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  Alias
                </Grid>
                <Box>
                  <TextField
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    sx={{ height: "12px" }}
                  />
                </Box>
              </Grid>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="outlined">
            Close
          </Button>
          <Button onClick={onSubmit} autoFocus variant="contained">
            Update Alias
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Instructions;
