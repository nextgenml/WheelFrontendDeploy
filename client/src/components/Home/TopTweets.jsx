/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, Typography } from "@mui/material";
import { getAPICall } from "../../API";
import config from "../../config";
const headers = ["Tweet"];

export default function TopTweets() {
  const [referrals, setRecords] = React.useState([]);
  const topRecords = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/chores/topTweets`
    );
    setRecords(data.data);
  };
  React.useEffect(() => {
    topRecords();
  }, []);
  return (
    <Paper elevation={0}>
      <TableContainer sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "8px" }}>
          Top 10 Tweets
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
                key={row.link_to_post}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <Link href={row.link_to_post} target="_blank">
                    {row.link_to_post}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
