/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  TextField,
  Box,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import config from "../../config";
import { useState } from "react";

function ShowBlog({ onClose, currentRow }) {
  const [blog, setBlog] = useState(currentRow.blog);
  const onUpdate = async () => {
    let data = {
      transactionID: currentRow.transactionID,
      validatedFlag: currentRow.validated_flag,
      paidFlag: currentRow.paid_flag,
      promoted: currentRow.promoted,
      blog: blog,
    };
    const url = `${config.API_ENDPOINT}/update-blog-data`;
    let response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "PUT",
    });

    if (response.ok) {
      alert("updated successfully");
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };
  return (
    <Dialog
      onClose={() => onClose()}
      open
      PaperProps={{
        style: { width: "1000px", maxWidth: "1000px" },
      }}
    >
      <DialogTitle>Blog Content</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <TextField
            value={blog}
            fullWidth
            multiline
            onChange={(e) => setBlog(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowBlog;
