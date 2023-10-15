/* eslint-disable react-hooks/exhaustive-deps */
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Grid,
  TablePagination,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useEffect, useState } from "react";
import Chore from "./Chore";
import styles from "./Chores.module.css";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { getAPICall } from "../../../API";
import config from "../../../config";
import { useSearchParams } from "react-router-dom";

const ChoresLevel = ({ level, campaignId, address, closeCollapse }) => {
  const [open, setOpen] = useState(false);
  const [chores, setChores] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, _] = useSearchParams();
  const [filter, setFilter] = useState("all");
  const fetchData = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/${campaignId}/levels/${
        level.level
      }?walletId=${address}&pageNo=${page}&pageSize=${rowsPerPage}&filter=${filter}&campaigner=${searchParams.get(
        "campaigner"
      )}`
    );

    setChores(data.data);
    setTotalCount(data.total_count);
  };

  useEffect(() => {
    if (open && campaignId) fetchData();
  }, [open, rowsPerPage, page, filter]);

  useEffect(() => {
    setOpen(false);
  }, [closeCollapse]);

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
        <Box>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="completed"
                control={<Radio />}
                label="Completed"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Grid container spacing={2}>
          {chores.map((c) => (
            <Grid item md={6} xs={12}>
              <Chore chore={c} />
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
