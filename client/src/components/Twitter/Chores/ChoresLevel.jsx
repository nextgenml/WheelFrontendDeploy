import {
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Grid,
} from "@mui/material";
import { useState } from "react";
import Chore from "./Chore";
import styles from "./Chores.module.css";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
const ChoresLevel = () => {
  const [open, setOpen] = useState(false);
  const [chores, setChores] = useState([1, 2, 3]);
  return (
    <>
      <ListItem
        disablePadding
        onClick={() => setOpen((prev) => !prev)}
        className={styles.listItem}
      >
        <ListItemButton>
          <ListItemText primary="Level" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open}>
        <Grid container spacing={2}>
          {chores.map((c) => (
            <Grid item md={6} xs={12}>
              <Chore />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  );
};
export default ChoresLevel;
