/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, Typography } from "@mui/material";
import styles from "./MovieTickets.module.css";
import { customFetch } from "../../API";
import config from "../../config";
import { useSearchParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAccount } from "wagmi";

const headers = ["Movie Name", "Status", "Tweet"];

const stateText = (state) => {
  switch (state) {
    case "paid":
      return "Paid";
    case "completed":
      return "In Verification";
    case "rejected":
      return "Rejected";
    default:
      return "In Progress....";
  }
};
export default function PastMovies({ count }) {
  const [records, setRecords] = React.useState([]);
  const [searchParams, _] = useSearchParams();
  const { address } = useAccount();

  const fetchData = async () => {
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/movies?viewAs=${
        searchParams.get("viewAs") || ""
      }&walletId=${address}`
    );
    if (res.ok) {
      const { data } = await res.json();
      setRecords(data);
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [count]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ width: "100%" }}>
        <TableContainer component={Paper}>
          <Typography variant="h6" className={styles.pastTableHeader}>
            Past Movie Tickets
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
              {records.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{row.movie_name}</TableCell>
                  <TableCell>{stateText(row.workflow_state)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `🍿🎟️ Just watched ${row.movie_name.toUpperCase()} movie and got reimbursed for the ticket, small drink, and popcorn! 😄🎥 Weekly movie nights, here I come! 🙌 #MovieMagic #MoviesForFree, #DiscountedMovies, #OwnAMemory, #Memory, #Memories, #NexGenML, #Dreams, #Entertainment`
                        )
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
