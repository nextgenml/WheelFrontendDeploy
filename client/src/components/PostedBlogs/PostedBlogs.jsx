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
  Button,
} from "@mui/material";
import styles from "./PostedBlogs.module.css";
import { fetchPostedBlogsAPI, updatePostedBlogAPI } from "../../API/Blogs";
import config from "../../config";
import { useAccount } from "wagmi";
import ShowBlog from "../NXMLChat/ShowBlog";
import ViewLinks from "./ViewLinks";

const headers = [
  "Initiative",
  "Prompt",
  "Blog",
  "Links",
  "Posted On",
  "Is Valid",
];

export default function PostedBlogs() {
  const { address } = useAccount();
  const [blogs, setBlogs] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [saveBlog, setSaveBlog] = React.useState(null);
  const [saveLinks, setSaveLinks] = React.useState(null);
  const fetchData = async () => {
    const res = await fetchPostedBlogsAPI(address, page, rowsPerPage);
    if (res.blogs) {
      setBlogs(res.blogs);
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

  const isAdmin = address === config.ADMIN_WALLET_1;

  const onUpdate = async (links, id) => {
    const res = await updatePostedBlogAPI(address, { links });
    if (res) {
      const currentRow = blogs.filter((p) => p.id === id)[0];
      // currentRow.paid_referer = paid ? 1 : 0;
      setBlogs([...blogs]);
    }
  };
  return (
    <>
      <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6" className={styles.tableHeader}>
            Your Posts
          </Typography>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                {headers.map((h) => {
                  return <TableCell>{h}</TableCell>;
                })}
                {isAdmin && <TableCell></TableCell>}
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
