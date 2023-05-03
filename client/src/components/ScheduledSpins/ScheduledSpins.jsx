/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Typography,
  TablePagination,
  Link,
  Stack,
  TextField,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormControl,
} from "@mui/material";
import styles from "./ScheduledSpins.module.css";
import { useAccount } from "wagmi";
import { fetchPaymentsAPI } from "../../API/Payments";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";
import config from "../../config";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";

const headers = [
  "Type",
  "Run At",
  "Spin Day",
  "Minimum Wallet Balance",
  "No of winners",
  "Winner Prizes",
  "Is Active",
];

export default function ScheduledSpins() {
  const { address } = useAccount();
  const [records, setRecords] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [fromDate, setFromDate] = React.useState(moment());
  const [toDate, setToDate] = React.useState(moment());
  const [search, setSearch] = React.useState("");

  const fetchData = async () => {
    const res = await fetchPaymentsAPI(address, {
      page,
      rowsPerPage,
      search,
      fromDate: moment(fromDate.toString()).startOf("day").format(),
      toDate: moment(toDate.toString()).endOf("day").format(),
    });
    if (res.data) {
      setRecords(res.data);
      setTotalCount(res.count);
    }
  };
  const isAdmin = config.ADMIN_WALLET_1 === address;
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
    <>
      <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6" className={styles.tableHeader}>
            Configure Spins
          </Typography>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {headers.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.run_at}</TableCell>
                  <TableCell>{row.min_wallet_amount}</TableCell>
                  <TableCell>{row.no_of_winners}</TableCell>
                  <TableCell>{row.winner_prizes}</TableCell>
                  <TableCell>{row.is_active}</TableCell>
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
    </>
  );
}
