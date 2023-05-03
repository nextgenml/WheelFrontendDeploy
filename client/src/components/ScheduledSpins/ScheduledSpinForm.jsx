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
} from "@mui/material";
import config from "../../config";
import { useState } from "react";
import { writeAPICall } from "../../API/index.js";
import styles from "./ScheduledSpins.module.css";

const SPIN_TYPES = ["weekly", "biweekly", "monthly", "yearly", "adhoc"];
function ScheduledSpinForm({ onClose, currentRow }) {
  const [rowData, setRowData] = useState(currentRow);

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
        <Box className={styles.formInputBox}>
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
        </Box>
        <FormGroup sx={{ m: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData.is_active === 1}
                onChange={(e) => {
                  console.log(" e.target.value,", e.target.checked);
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
