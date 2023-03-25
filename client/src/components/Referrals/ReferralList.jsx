/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TablePagination } from "@mui/material";
import styles from "./Referrals.module.css";
import { fetchReferralsAPI } from "../../API/Referrals";

const headers = [
  "Referee",
  "Referred At",
  "Twitter",
  "Facebook",
  "LinkedIn",
  "Criteria Met",
  "Criteria Met At",
  "Referral Paid",
];

export default function ReferralList({ address, count }) {
  const [referrals, setReferrals] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchData = async () => {
    const res = await fetchReferralsAPI(address, page, rowsPerPage);
    if (res.referrals) {
      setReferrals(res.referrals);
      setTotalCount(res.totalCount);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, count]);

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
        <Typography variant="h6" className={styles.campaignsTableHeader}>
          Your Referrals
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
            {referrals.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.referee_twitter}</TableCell>
                <TableCell>{row.referred_at}</TableCell>
                <TableCell>{row.criteria_count}</TableCell>
                <TableCell>{row.criteria_count}</TableCell>
                <TableCell>{row.criteria_count}</TableCell>
                <TableCell>{row.criteria_met === 1 ? "Yes" : "No"}</TableCell>
                <TableCell>{row.criteria_met_at}</TableCell>
                <TableCell>{row.paid_referer === 1 ? "Yes" : "No"}</TableCell>
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
