import {
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Grid,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Chore from "./Chore";
import styles from "./Chores.module.css";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
const ChoresLevel = ({ level }) => {
  const [open, setOpen] = useState(false);
  const [chores, setChores] = useState([1, 2, 3]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <ListItem
        disablePadding
        onClick={() => setOpen((prev) => !prev)}
        className={styles.listItem}
      >
        <ListItemButton>
          <ListItemText
            primary={
              <Box>
                <Typography variant="subtitle1" fontWeight={"bold"}>
                  Level {level.level}
                </Typography>
                <Typography variant="body2">
                  Completed: <b>{level.completed} </b>| Assigned:{" "}
                  <b>{level.assigned}</b>
                </Typography>
              </Box>
            }
          />
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
          <Grid item md={12}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
};
export default ChoresLevel;
