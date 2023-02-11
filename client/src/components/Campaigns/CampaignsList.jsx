/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import config from "../../config";
import moment from "moment";
import {
  Button,
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

const headers = [
  "Client Name",
  "Campaign Name",
  "Strategy",
  "Start Time",
  "End Time",
];

export default function CampaignsList({ address, count }) {
  const [campaigns, setCampaigns] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const fetchData = async () => {
    const res1 = await fetch(
      `${config.API_ENDPOINT}/campaigns?walletId=${address}&search=${search}&pageNo=${page}&pageSize=${rowsPerPage}`
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

  const onUpdate = async (action, campaignId) => {
    const res = await fetch(
      `${config.API_ENDPOINT}/update-campaign?walletId=${address}&userAction=${action}&campaignId=${campaignId}`,
      {
        method: "POST",
      }
    );
    if (res.ok) {
      alert(action === "disable" ? "Campaign disabled" : "Campaign enabled");
    } else {
      const error = await res.json();
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
    }
    const currentCampaign = campaigns.filter((p) => p.id === campaignId)[0];
    currentCampaign.is_active = action === "disable" ? 0 : 1;
    console.log("campaigns", campaigns);
    setCampaigns([...campaigns]);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" className={styles.campaignsTableHeader}>
          Saved Campaigns
        </Typography>
        <FormControl
          sx={{ m: 1, mb: 2, width: "25ch", float: "right" }}
          variant="outlined"
        >
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
              {headers.map((h) => {
                return <TableCell>{h}</TableCell>;
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: row.is_active ? "" : "#FFCCCB",
                }}
              >
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.campaign}</TableCell>
                <TableCell>{row.success_factor}</TableCell>
                <TableCell>
                  {moment(row.start_time).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell>
                  {moment(row.end_time).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell>
                  {row.is_active ? (
                    <Button
                      color="error"
                      onClick={() => onUpdate("disable", row.id)}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onUpdate("enable", row.id)}
                      color="success"
                    >
                      Enable
                    </Button>
                  )}
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
