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
import styles from "./TotalEarnings.module.css";
import { useAccount } from "wagmi";
import { fetchPaymentsAPI } from "../../API/Payments";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";
import config from "../../config";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";

const headers = ["Type", "Is Paid", "Amount", "Earned Date", "Details"];

export default function TotalEarnings() {
  const { address } = useAccount();
  const [payments, setPayments] = React.useState([]);
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
    if (res.payments) {
      setPayments(res.payments);
      setTotalCount(res.totalCount);
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
            Details
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              spacing={3}
              sx={{ m: 3, mt: 0 }}
              direction={"row"}
              alignContent={"center"}
              justifyItems={"center"}
            >
              <DatePicker
                inputFormat="DD/MM/YYYY"
                label={"Select From Date"}
                value={fromDate}
                onChange={(value) => setFromDate(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Select From Date"}
                    className={styles.datePickerText}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "dd/mm/yyyy",
                    }}
                  />
                )}
              />
              <DatePicker
                inputFormat="DD/MM/YYYY"
                label={"Select To Date"}
                value={toDate}
                onChange={(value) => setToDate(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Select To Date"}
                    className={styles.datePickerText}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "dd/mm/yyyy",
                    }}
                  />
                )}
              />
              <Button variant="outlined" onClick={fetchData}>
                Submit
              </Button>

              {isAdmin && (
                <>
                  <FormControl
                    sx={{
                      m: 1,
                      mb: 2,
                      width: "25ch",
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
                </>
              )}
            </Stack>
          </LocalizationProvider>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {isAdmin && <TableCell>Wallet Id</TableCell>}
                {headers.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {isAdmin && <TableCell>{row.wallet_id}</TableCell>}
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.is_paid}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    {moment(row.earned_at).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={
                        row.type === "referral"
                          ? `/referrals?walletId=${row.wallet_id}`
                          : `/posted-blogs?date=${moment(row.earned_at).format(
                              "YYYY-MM-DD"
                            )}&walletId=${row.wallet_id}`
                      }
                    >
                      View <LaunchIcon />
                    </Link>
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
    </>
  );
}
