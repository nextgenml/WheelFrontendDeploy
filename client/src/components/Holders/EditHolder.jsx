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
} from "@mui/material";
import config from "../../config";
import { useState } from "react";
import { writeAPICall } from "../../API/index.js";

function EditHolder({ onClose, currentRow }) {
  const [rowData, setRowData] = useState(currentRow);
  const onUpdate = async () => {
    const data = {
      minimum_balance_for_ai: rowData.minimum_balance_for_ai,
      is_banned: rowData.is_banned,
      wallet_id: currentRow.wallet_id,
    };
    const url = `${config.API_ENDPOINT}/api/v1/holders`;
    await writeAPICall(url, data, "PUT");
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
      <DialogTitle>Update Holder</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <TextField
            value={rowData.minimum_balance_for_ai}
            fullWidth
            label="Minimum Balance to use Converse with AI"
            onChange={(e) =>
              setRowData((prev) => ({
                ...prev,
                minimum_balance_for_ai: e.target.value,
              }))
            }
          />
        </Box>
        <FormGroup sx={{ p: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData.is_banned === 1}
                onChange={(e) => {
                  console.log(" e.target.value,", e.target.checked);
                  setRowData((prev) => ({
                    ...prev,
                    is_banned: e.target.checked ? 1 : 0,
                  }));
                }}
              />
            }
            label="Is Banned"
          />
        </FormGroup>
        {console.log(" rowData.is_banned target.value", rowData.is_banned)}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={onUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditHolder;
