import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { List, ListItem, TextField, Grid } from "@mui/material";
import config from "../../config";

const Instructions = ({ generatedAlias, address }) => {
  const [open, setOpen] = React.useState(false);
  const [alias, setAlias] = React.useState(generatedAlias || "");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    setAlias(generatedAlias);
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
        body: JSON.stringify({ newAlias: alias }),
      }
    );
    if (res.ok) {
      alert("Alias updated successfully");
      handleClose();
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
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </ListItem>
            <ListItem>
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </ListItem>
            <ListItem sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  Alias
                </Grid>
                <TextField
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  sx={{ height: "12px" }}
                />
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
