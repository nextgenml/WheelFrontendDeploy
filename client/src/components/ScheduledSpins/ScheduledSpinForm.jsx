/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  TextField,
  Box,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import config from "../../config";
import { useState } from "react";
import { getAPICall, writeAPICall } from "../../API/index.js";
import styles from "./ScheduledSpins.module.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";

const SPIN_TYPES = ["weekly", "biweekly", "monthly", "yearly", "adhoc"];
const CURRENCIES = ["eeth", "nml"];
function ScheduledSpinForm({ onClose, currentRow }) {
  const [rowData, setRowData] = useState(currentRow);
  const [fromDate, setFromDate] = useState(moment());
  const [toDate, setToDate] = useState(moment());
  const [minBlogsCount, setMinBlogsCount] = useState(0);
  const fetchParticipants = async () => {
    const url = `${config.API_ENDPOINT}/api/v1/blogs/adhoc_spin/participants?from=${fromDate}&to=${toDate}&min=${minBlogsCount}`;
    const data = await getAPICall(url);
    setRowData((prev) => ({
      ...prev,
      participants: data.data.join(","),
    }));
  };
  const onUpdate = async () => {
    const url = `${config.API_ENDPOINT}/api/v1/scheduledSpins/`;
    if (rowData.id > 0) await writeAPICall(url + rowData.id, rowData, "PUT");
    else await writeAPICall(url, rowData, "POST");
    onClose(true);
  };
  return (
    <Dialog
      onClose={() => onClose()}
      open
      PaperProps={{
        style: { width: "1000px", maxWidth: "1000px" },
      }}
    >
      <DialogTitle>Update Spin</DialogTitle>
      <DialogContent>
        <Box
          className={styles.formInputBox}
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rowData.type}
              label="Type"
              onChange={(e) =>
                setRowData((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
            >
              {SPIN_TYPES.map((x) => (
                <MenuItem value={x}>{x}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {rowData.type === "adhoc" && (
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack
                  spacing={3}
                  sx={{ m: 3, mt: 0 }}
                  direction={"row"}
                  alignContent={"center"}
                  justifyItems={"center"}
                >
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={"Select From Date"}
                    value={fromDate}
                    onChange={(value) => setFromDate(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Select From Date"}
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
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={"Select To Date"}
                    value={toDate}
                    onChange={(value) => setToDate(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Select To Date"}
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
                  <TextField
                    value={minBlogsCount}
                    label="Blogs Count"
                    onChange={(e) => setMinBlogsCount(e.target.value)}
                  />
                  <Button variant="outlined" onClick={fetchParticipants}>
                    Submit
                  </Button>
                </Stack>
              </LocalizationProvider>
              <TextField
                value={rowData.participants}
                fullWidth
                label={`Adhoc spin participants. Total(${
                  (rowData.participants || "").split(",").length
                })`}
                readonly
              />
            </Box>
          )}

          <TextField
            value={rowData.run_at}
            fullWidth
            label="Run Time"
            onChange={(e) =>
              setRowData((prev) => ({
                ...prev,
                run_at: e.target.value,
              }))
            }
          />
          <TextField
            value={rowData.spin_day}
            fullWidth
            label="Spin Day. Rules are different for different spins."
            onChange={(e) =>
              setRowData((prev) => ({
                ...prev,
                spin_day: e.target.value,
              }))
            }
          />
          <TextField
            value={rowData.min_wallet_amount}
            fullWidth
            label="Minimum Wallet Balance"
            onChange={(e) =>
              setRowData((prev) => ({
                ...prev,
                min_wallet_amount: e.target.value,
              }))
            }
          />
          <TextField
            value={rowData.winner_prizes}
            fullWidth
            label="Winner Prizes"
            onChange={(e) =>
              setRowData((prev) => ({
                ...prev,
                winner_prizes: e.target.value,
              }))
            }
          />
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rowData.currency}
              label="Currency"
              onChange={(e) =>
                setRowData((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
            >
              {CURRENCIES.map((x) => (
                <MenuItem value={x}>{x}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <FormGroup sx={{ m: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData.is_diamond === 1}
                onChange={(e) => {
                  setRowData((prev) => ({
                    ...prev,
                    is_diamond: e.target.checked ? 1 : 0,
                  }));
                }}
              />
            }
            label="Is Diamond Spin"
          />
        </FormGroup>
        <FormGroup sx={{ m: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData.is_active === 1}
                onChange={(e) => {
                  setRowData((prev) => ({
                    ...prev,
                    is_active: e.target.checked ? 1 : 0,
                  }));
                }}
              />
            }
            label="Is Active"
          />
        </FormGroup>
        {console.log(" rowData.is_banned target.value", rowData.is_banned)}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={onUpdate}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ScheduledSpinForm;
