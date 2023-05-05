/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TablePagination, Link } from "@mui/material";
import styles from "./SocialSharingAdmin.module.css";
import LaunchIcon from "@mui/icons-material/Launch";
import { getAPICall } from "../../API";
import config from "../../config";

const headers = [
  "Wallet Id",
  "# chores Assigned",
  "# chores completed",
  "# likes Assigned",
  "# retweets Assigned",
  "# follows Assigned",
  "# validations Assigned",
  "Overall paid",
  "Overall unpaid",
  "Today paid",
  "Today unpaid",
  "Today Potential",
  "",
];

export default function SocialSharingAdmin() {
  const [records, setRecords] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchData = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/chores/adminStats?pageNo=${page}&pageSize=${rowsPerPage}`
    );
    if (res.data) {
      setRecords(res.data);
      setTotalCount(res.count);
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
                  <TableCell>{row.wallet_id}</TableCell>
                  <TableCell>{row.totalAssigned}</TableCell>
                  <TableCell>{row.totalCompleted}</TableCell>
                  <TableCell>{row.likeCount}</TableCell>
                  <TableCell>{row.retweetCount}</TableCell>
                  <TableCell>{row.followCount}</TableCell>
                  <TableCell>{row.validateCount}</TableCell>

                  <TableCell>{row.totalPaid}</TableCell>
                  <TableCell>{row.totalUnpaid}</TableCell>
                  <TableCell>{row.todayPaid}</TableCell>
                  <TableCell>{row.todayUnpaid}</TableCell>
                  <TableCell>{row.todayMax}</TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`social-sharing?viewAs=${row.wallet_id}`}
                    >
                      View As User <LaunchIcon />
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