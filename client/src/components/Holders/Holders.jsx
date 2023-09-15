/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import {
  Typography,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Box,
  FormControl,
  Link,
} from "@mui/material";
import styles from "./Holders.module.css";
import { searchHoldersAPI } from "../../API/Holder";
import EditHolder from "./EditHolder";
import config from "../../config";

const headers = [
  "Wallet Id",
  "Minimum Balance to use AI",
  "Is Banned",
  "Own a Memory",
  "",
];

export default function Holders() {
  const [holders, setHolders] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [currentRow, setCurrentRow] = React.useState(null);
  const fetchData = async () => {
    const res = await searchHoldersAPI(search);
    if (res) {
      setHolders([res]);
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6" className={styles.tableHeader}>
            Search Holders using wallet Id
          </Typography>
          <Box display={"flex"} alignItems={"center"}>
            <FormControl
              sx={{
                m: 1,
                mb: 2,
                width: "50ch",
                marginLeft: "auto !important",
              }}
              variant="outlined"
            >
              <InputLabel>Search using wallet id</InputLabel>
              <OutlinedInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                label="Search using wallet id"
              />
            </FormControl>
            <Button variant="outlined" onClick={fetchData}>
              Search
            </Button>
          </Box>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {headers.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {holders.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{row.wallet_id}</TableCell>
                  <TableCell>{row.minimum_balance_for_ai}</TableCell>
                  <TableCell>{row.is_banned === 0 ? "No" : "Yes"}</TableCell>
                  <TableCell>
                    <Link
                      href={`/own-a-memory?viewAs=${row.wallet_id}`}
                      target="_blank"
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell>
                    {<EditIcon onClick={() => setCurrentRow(row)} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {currentRow && (
        <EditHolder
          currentRow={currentRow}
          onClose={(saved) => {
            setCurrentRow(null);
            if (saved) fetchData();
          }}
        />
      )}
    </>
  );
}
