/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TablePagination, Button, Box } from "@mui/material";
import styles from "./ScheduledSpins.module.css";
import { fetchSpinsAPI } from "../../API/ScheduledSpins";
import ScheduledSpinForm from "./ScheduledSpinForm";
import EditIcon from "@mui/icons-material/Edit";
import { getAPICall } from "../../API";
import config from "../../config";

const headers = [
  "Type",
  "Run At",
  "Spin Day",
  "Minimum Wallet Balance",
  "No of winners",
  "Currency",
  "Winner Prizes",
  "Is Active",
  "",
];

const ADMIN_NOTES_HEADERS = ["Type", "Spin Day", "Run At"];
const ADMIN_NOTES_DATA = [
  {
    type: "Adhoc",
    spin_day: "DD:MM:YYYY",
    spin_at: "HH:mm - 24 hour clock format",
  },
  {
    type: "Weekly",
    spin_day:
      "What day in week(Monday(1) - Sunday(7)). eg: if spins needs to be run on saturday, value will be 6.",
    spin_at: "HH:mm - 24 hour clock format",
  },
  {
    type: "Daily",
    spin_day: "NA - do not put anything",
    spin_at: "HH:mm - 24 hour clock format",
  },
  {
    type: "Biweekly",
    spin_day:
      "DD:DD - eg: if you want to run 1st spin on 4th of every month, and 2nd spin on 28th of month, value is gonna be 4:28",
    spin_at: "HH:mm - 24 hour clock format",
  },
  {
    type: "Monthly",
    spin_day:
      "MM, eg: If spin needs to be run on 1st of every month, then value gonna be 1",
    spin_at: "HH:mm - 24 hour clock format",
  },
  {
    type: "Yearly",
    spin_day:
      "DD:MM, eg: If spin needs to be run on 1st of dec every year, then value gonna be 1:12",
    spin_at: "HH:mm - 24 hour clock format",
  },
];
export default function ScheduledSpins() {
  const [records, setRecords] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [nextSpin, setNextSpin] = React.useState(null);
  const fetchData = async () => {
    const res = await fetchSpinsAPI(page, rowsPerPage);
    if (res.data) {
      setRecords(res.data);
      setTotalCount(res.count);
    }
  };
  const fetchNextSpin = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/scheduledSpins/next`
    );
    if (res.data) {
      setNextSpin(res.data);
    }
  };
  React.useEffect(() => {
    fetchNextSpin();
  }, []);
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
            Next Spin
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
              {nextSpin && (
                <TableRow
                  key={nextSpin.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{nextSpin.type}</TableCell>
                  <TableCell>{nextSpin.run_at}</TableCell>
                  <TableCell>{nextSpin.spin_day}</TableCell>
                  <TableCell>{nextSpin.min_wallet_amount}</TableCell>
                  <TableCell>{nextSpin.no_of_winners}</TableCell>
                  <TableCell>{nextSpin.currency}</TableCell>
                  <TableCell>{nextSpin.winner_prizes}</TableCell>
                  <TableCell>{nextSpin.is_active}</TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => {
                        setCurrentRow(nextSpin);
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6" className={styles.tableHeader}>
            Configure Spins
            <Button
              variant="outlined"
              sx={{ ml: 4 }}
              onClick={() => setCurrentRow({})}
            >
              Create New
            </Button>
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
                  <TableCell>{row.spin_day}</TableCell>
                  <TableCell>{row.min_wallet_amount}</TableCell>
                  <TableCell>{row.no_of_winners}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.winner_prizes}</TableCell>
                  <TableCell>{row.is_active}</TableCell>
                  <TableCell>
                    <EditIcon onClick={() => setCurrentRow(row)} />
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
      <Box>
        <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
          <TableContainer component={Paper} sx={{ p: 2 }}>
            <Typography variant="h6" className={styles.tableHeader}>
              How to configure Spins
            </Typography>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                  {ADMIN_NOTES_HEADERS.map((h) => {
                    return <TableCell>{h}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {ADMIN_NOTES_DATA.map((row) => (
                  <TableRow
                    key={row.type}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.spin_day}</TableCell>
                    <TableCell>{row.run_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {currentRow && (
        <ScheduledSpinForm
          currentRow={currentRow}
          onClose={(saved) => {
            setCurrentRow(null);
            if (saved) {
              fetchData();
              fetchNextSpin();
            }
          }}
        />
      )}
    </>
  );
}
