/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import config from "../../config";
import Menu from "@mui/material/Menu";

import {
  Button,
  Typography,
  TablePagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
} from "@mui/material";
import styles from "./Promotions.module.css";

const headers = [
  "Receiver Wallet",
  "Payer Wallet",
  "Blogs Limit",
  "Promotions Limit",
  "ETH",
  "Status",
  "Reason",
  "",
  "",
];

export default function PromotionsList({ address, count }) {
  const [promotions, setPromotions] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const fetchData = async () => {
    let url;
    if (config.ADMIN_WALLET === address)
      url = `${config.API_ENDPOINT}/promotions-admin?walletId=${address}&pageNo=${page}&pageSize=${rowsPerPage}`;
    else
      url = `${config.API_ENDPOINT}/promotions?walletId=${address}&pageNo=${page}&pageSize=${rowsPerPage}`;
    const res1 = await fetch(url);
    if (res1.ok) {
      const data = await res1.json();
      setPromotions(data.data);
      setTotalCount(data.total_count);
    } else {
      alert("Something went wrong. Unable to fetch promotion requests");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [rowsPerPage, page, count]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onUpdate = async (status, reason, requestId) => {
    const res = await fetch(`${config.API_ENDPOINT}/approve-promotion`, {
      method: "POST",
      body: JSON.stringify({
        walletId: address,
        status,
        requestId,
        reason,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      alert("Saved successfully");
    } else {
      const error = await res.json();
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
    }
    // const currentPromotion = promotions.filter((p) => p.id === requestId)[0];
    // currentPromotion.reason = reason;
    // currentPromotion.status = status;
    // setPromotions([...currentPromotion]);
    fetchData();
    setAnchorEl(null);
    setSelectedRow({});
    setSelectedReason("");
  };

  const onUserUpdate = async (requestId) => {
    const res = await fetch(`${config.API_ENDPOINT}/mark-promotion-done-user`, {
      method: "POST",
      body: JSON.stringify({
        walletId: address,
        requestId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      alert("Saved successfully");
    } else {
      const error = await res.json();
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
    }
    fetchData();
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Typography variant="h6" className={styles.campaignsTableHeader}>
          Applied Requests
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
            {promotions.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.receiver_wallet_id}</TableCell>
                <TableCell>{row.payer_wallet_id}</TableCell>
                <TableCell>{row.blogs_limit}</TableCell>
                <TableCell>{row.overall_promotions_limit}</TableCell>
                <TableCell>{row.eth_amount}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.reason}</TableCell>
                {address === config.ADMIN_WALLET ? (
                  <>
                    <TableCell>
                      <Button
                        color="success"
                        onClick={(e) => {
                          setSelectedRow({ id: row.id, action: "approved" });
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={(e) => {
                          setSelectedRow({ id: row.id, action: "rejected" });
                          setAnchorEl(e.currentTarget);
                        }}
                        color="error"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={row.mark_as_done_by_user}
                              checked={!!row.mark_as_done_by_user}
                              onChange={(e) => onUserUpdate(row.id)}
                            />
                          }
                          label="Paid"
                        />
                      </FormGroup>
                    </TableCell>
                    <TableCell></TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
          {
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open && (selectedRow?.id || 0) > 0}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Box sx={{ p: 2 }}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    onUpdate(selectedRow.action, selectedReason, selectedRow.id)
                  }
                >
                  {selectedRow.action === "approved" ? "approve" : "reject"}
                </Button>
              </Box>
            </Menu>
          }
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
