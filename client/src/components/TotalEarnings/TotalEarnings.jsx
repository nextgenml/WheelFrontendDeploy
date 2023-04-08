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
import styles from "./TotalEarnings.module.css";
import { useAccount } from "wagmi";
import { fetchPaymentsAPI } from "../../API/Payments";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";

const headers = ["Type", "Is Paid", "Amount", "Earned Date", "Details"];

export default function TotalEarnings() {
  const { address } = useAccount();
  const [payments, setPayments] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const fetchData = async () => {
    const res = await fetchPaymentsAPI(address, page, rowsPerPage);
    if (res.payments) {
      setPayments(res.payments);
      setTotalCount(res.totalCount);
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
            Your Payments
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
              {payments.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
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
                          ? `/referrals`
                          : `/posted-blogs?date=${moment(row.earned_at).format(
                              "YYYY-MM-DD"
                            )}`
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
