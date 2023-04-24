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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styles from "./Referrals.module.css";
import { fetchReferralsAPI, updateReferralAPI } from "../../API/Referrals";
import config from "../../config";

const headers = [
  "Referee",
  "Referred At",
  "Twitter",
  "Facebook",
  "LinkedIn",
  "Criteria Met",
  "Criteria Met Date",
  "Referral Paid",
];

export default function ReferralList({
  address,
  count,
  setInvite,
  finalWallet,
}) {
  const [referrals, setReferrals] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchData = async () => {
    const res = await fetchReferralsAPI(finalWallet, page, rowsPerPage);
    if (res.referrals) {
      setReferrals(res.referrals);
      setTotalCount(res.totalCount);
      setInvite(res.inviteLink);
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

  const isAdmin = address === config.ADMIN_WALLET_1;

  const onUpdate = async (paid, id) => {
    const res = await updateReferralAPI(address, id, { paid });
    if (res) {
      const currentRow = referrals.filter((p) => p.id === id)[0];
      currentRow.paid_referer = paid ? 1 : 0;
      setReferrals([...referrals]);
    }
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
                return <TableCell key={h}>{h}</TableCell>;
              })}
              {isAdmin && <TableCell></TableCell>}
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
                <TableCell>
                  {isAdmin && (
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.paid_referer}
                            onChange={(e) => onUpdate(e.target.checked, row.id)}
                          />
                        }
                        label="Mark as Paid"
                      />
                    </FormGroup>
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
