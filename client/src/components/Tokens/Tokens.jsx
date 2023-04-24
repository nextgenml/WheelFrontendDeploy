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
import styles from "./Tokens.module.css";
import {
  Typography,
  FormControl,
  OutlinedInput,
  InputLabel,
  Box,
  Button,
} from "@mui/material";
import { useAccount } from "wagmi";
import moment from "moment";
import { customFetch } from "../../API/index.js";

const headers = [
  "Token",
  "Calculated At",
  "Max Supply",
  "Balance",
  "Percentage",
  "Allocation",
  "Max Allocation",
  ...Array.from({ length: 12 }, (_, i) => `MileStone ${i + 1}`),
];
const adminHeaders = [
  "Token",
  "No of holders",
  "Max Supply",
  "Balance",
  "Percentage",
  "Allocation",
  "Max Allocation",
  "Token",
  ...Array.from({ length: 12 }, (_, i) => `MileStone ${i + 1}`),
];

const Tokens = () => {
  const [tokens, setTokens] = React.useState([]);
  const [adminStats, setAdminStats] = React.useState([]);
  const { address } = useAccount();
  const [search, setSearch] = React.useState("");
  const isAdmin = config.ADMIN_WALLET_1 === address;
  const fetchAdminData = async () => {
    let url = `${config.API_ENDPOINT}/admin-token-stats?walletId=${address}`;

    const res1 = await customFetch(url);
    if (res1.ok) {
      const { data } = await res1.json();
      setAdminStats(data);
    } else {
      alert("Something went wrong. Unable to fetch info");
    }
  };
  const fetchData = async () => {
    let url = `${config.API_ENDPOINT}/get-user-tokens?walletId=${address}&search=${search}`;

    const res1 = await customFetch(url);
    if (res1.ok) {
      const data = await res1.json();
      setTokens(data.data);
    } else {
      alert("Something went wrong. Unable to fetch info");
    }
  };

  React.useEffect(() => {
    if (isAdmin) fetchAdminData();
    fetchData();
  }, []);

  const formatNumber = (num) =>
    parseInt(num) > 0 ? num.toLocaleString("en-US") : 0;

  const renderTable = (row, admin) => {
    return (
      <TableRow
        key={row.token}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell>{row.token}</TableCell>
        <TableCell>
          {admin
            ? formatNumber(row.holdersCount)
            : moment.utc(row.lastRunAt).format()}
        </TableCell>
        <TableCell>{formatNumber(row.maxSupply)}</TableCell>
        <TableCell>{formatNumber(row.walletValue)}</TableCell>
        <TableCell>{row.sharePercent}</TableCell>
        <TableCell>{formatNumber(row.allocation)}</TableCell>
        <TableCell>{formatNumber(parseInt(row.maxAllocation))}</TableCell>
        {row.monthlyAllocations.map((x) => (
          <TableCell>{formatNumber(x)}</TableCell>
        ))}
      </TableRow>
    );
  };
  return (
    <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Box display={"flex"} justifyContent="space-between">
          <Box>
            <Typography variant="h6" className={styles.campaignsTableHeader}>
              Your Tokens
            </Typography>
            <Typography
              variant="subtitle2"
              className={styles.campaignsTableHeader}
            >
              Your Wallet: {address}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems="center">
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <InputLabel>Search with wallet</InputLabel>
              <OutlinedInput
                onChange={(e) => setSearch(e.target.value)}
                label="Search with wallet"
              />
            </FormControl>
            <Button variant="outlined" onClick={fetchData}>
              GET
            </Button>
          </Box>
        </Box>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
              {headers.map((h) => {
                return <TableCell>{h}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>{tokens.map((row) => renderTable(row))}</TableBody>
        </Table>
      </TableContainer>
      {isAdmin && (
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Box display={"flex"} justifyContent="space-between">
            <Box>
              <Typography variant="h6" className={styles.campaignsTableHeader}>
                Overall Stats
              </Typography>
            </Box>
          </Box>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {adminHeaders.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {adminStats.map((row) => renderTable(row, true))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Tokens;
