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
  Button,
  Stack,
  TextField,
} from "@mui/material";
import styles from "./PostedBlogs.module.css";
import { fetchPostedBlogsAPI } from "../../API/Blogs";
import { useAccount } from "wagmi";
import ShowBlog from "../NXMLChat/ShowBlog";
import ViewLinks from "./ViewLinks";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const headers = [
  "Initiative",
  "Prompt",
  "Blog",
  "Links",
  "Posted On",
  "Is Valid",
  "Details",
];

export default function PostedBlogs() {
  const { address } = useAccount();

  // eslint-disable-next-line no-unused-vars
  const [searchParams, _] = useSearchParams();
  const queryDate = searchParams.get("date") || moment().format("YYYY-MM-DD");

  const [blogs, setBlogs] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [saveBlog, setSaveBlog] = React.useState(null);
  const [saveLinks, setSaveLinks] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(queryDate);
  const fetchData = async () => {
    const res = await fetchPostedBlogsAPI(
      address,
      page,
      rowsPerPage,
      selectedDate || queryDate
    );
    if (res.blogs) {
      setBlogs(res.blogs);
      setTotalCount(res.totalCount);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, selectedDate]);

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
            Your Posts
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3} sx={{ m: 3, mt: 0 }}>
              <DatePicker
                inputFormat="DD/MM/YYYY"
                label={"Select Date"}
                value={selectedDate}
                onChange={(value) => setSelectedDate(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Select Date"}
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
            </Stack>
          </LocalizationProvider>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {headers.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{row.initiative}</TableCell>
                  <TableCell>{row.prompt}</TableCell>
                  <TableCell>
                    {row.blog.slice(0, 10)}....
                    <Button href="#" onClick={() => setSaveBlog(row)}>
                      View Blog
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button href="#" onClick={() => setSaveLinks(row)}>
                      View Links
                    </Button>
                  </TableCell>
                  <TableCell>{row.create_date}</TableCell>
                  <TableCell>{row.validated_flag}</TableCell>
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
      {saveBlog && (
        <ShowBlog
          currentRow={saveBlog}
          hideUpdate
          onClose={() => {
            setSaveBlog(null);
            fetchData();
          }}
        />
      )}
      {saveLinks && (
        <ViewLinks
          data={saveLinks}
          walletId={address}
          onClose={() => {
            setSaveLinks(null);
            fetchData();
          }}
        />
      )}
    </>
  );
}
