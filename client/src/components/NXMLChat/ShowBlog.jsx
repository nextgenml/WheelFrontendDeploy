/* eslint-disable react-hooks/exhaustive-deps */
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Grid, Typography } from "@mui/material";

function ShowBlog({ onClose, blog }) {
  return (
    <Dialog onClose={() => onClose()} open>
      <DialogTitle>Blog Content</DialogTitle>

      <Typography variant="body2" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
        {blog}
      </Typography>
    </Dialog>
  );
}

export default ShowBlog;
