/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import config from "../../../config";
import {
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  debounce,
} from "@mui/material";
import styles from "./Campaigns.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { customFetch } from "../../../API/index.js";
import EditIcon from "@mui/icons-material/Edit";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const headers = ["Campaign Name", "No of Users", "No of Levels", "", ""];

export default function CampaignsList({
  address,
  count,
  onSelectRow,
  onStatsRow,
}) {
  const [campaigns, setCampaigns] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const fetchData = async () => {
    const res1 = await customFetch(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns?walletId=${address}&search=${search}&pageNo=${page}&pageSize=${rowsPerPage}`
    );
    const data = await res1.json();
    setCampaigns(data.data);
    setTotalCount(data.total_count);
  };

  React.useEffect(() => {
    fetchData();
  }, [count, rowsPerPage, page, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const changeHandler = (event) => {
    setSearch(event.target.value);
  };
  const debouncedChangeHandler = React.useCallback(
    debounce(changeHandler, 500),
    []
  );

  return (
    <Paper sx={{ mb: 2 }}>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" className={styles.campaignsTableHeader}>
          Your Campaigns
        </Typography>
        <FormControl sx={{ m: 1, mb: 2, float: "right" }} variant="outlined">
          <InputLabel>Search</InputLabel>
          <OutlinedInput
            onChange={debouncedChangeHandler}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            label="Search"
          />
        </FormControl>
        <Table sx={{ m: 2, mr: 0, width: "97%" }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
              {headers.map((h) => {
                return <TableCell>{h}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: row.deleted_at ? "#FFCCCB" : "",
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.no_of_users}</TableCell>
                <TableCell>{row.no_of_levels}</TableCell>
                <TableCell>
                  <EditIcon onClick={() => onSelectRow(row)} />
                </TableCell>
                <TableCell>
                  <QueryStatsIcon onClick={() => onStatsRow(row)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
