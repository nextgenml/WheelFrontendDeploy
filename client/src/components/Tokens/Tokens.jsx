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
  TablePagination,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import { useAccount } from "wagmi";
import SearchIcon from "@mui/icons-material/Search";

const headers = [
  "Token",
  "Max Wallet Allocation",
  ...Array.from({ length: 12 }, (_, i) => i + 1),
];

const Tokens = () => {
  const [tokens, setTokens] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const { address } = useAccount();
  const [search, setSearch] = React.useState("");
  const fetchData = async () => {
    let url = `${config.API_ENDPOINT}/get-user-tokens?walletId=${address}&pageNo=${page}&pageSize=${rowsPerPage}&search=${search}`;

    const res1 = await fetch(url);
    if (res1.ok) {
      const data = await res1.json();
      setTokens(data.data);
      setTotalCount(data.total_count);
    } else {
      alert("Something went wrong. Unable to fetch promotion requests");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [rowsPerPage, page]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Box display={"flex"} justifyContent="space-between">
          <Box>
            <Typography variant="h6" className={styles.campaignsTableHeader}>
              Tokens
            </Typography>
            <Typography
              variant="subtitle2"
              className={styles.campaignsTableHeader}
            >
              Your Wallet: {address}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems="center">
            {config.ADMIN_WALLET_1 === address && (
              <>
                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                  <InputLabel>Search</InputLabel>
                  <OutlinedInput
                    onChange={(e) => setSearch(e.target.value)}
                    label="Search with wallet"
                  />
                </FormControl>
                <Button variant="outlined" onClick={fetchData}>
                  GET
                </Button>
              </>
            )}
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
          <TableBody>
            {tokens.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.token}</TableCell>
                <TableCell>{row.total_allocation}</TableCell>
                {row.monthly_allocations.map((x) => (
                  <TableCell>{x}</TableCell>
                ))}
                <TableCell>{row.blogs_limit}</TableCell>
                <TableCell>{row.overall_promotions_limit}</TableCell>
                <TableCell>{row.eth_amount}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.reason}</TableCell>
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
};

export default Tokens;
