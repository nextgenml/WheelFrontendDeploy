/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { topReferralsAPI } from "../../API/Referrals";
import { useAccount } from "wagmi";
const headers = ["Referee", "Total Referrals"];

export default function TopReferrals() {
  const { address } = useAccount();
  const [referrals, setReferrals] = React.useState([]);
  const topReferrals = async () => {
    const data = await topReferralsAPI(address);
    setReferrals(data.data);
  };
  React.useEffect(() => {
    topReferrals();
  }, []);
  return (
    <Paper elevation={0}>
      <TableContainer sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "8px" }}>
          Top 10 Referrals
        </Typography>
        <Table aria-label="simple table">
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
                <TableCell>{row.wallet_id}</TableCell>
                <TableCell>{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
