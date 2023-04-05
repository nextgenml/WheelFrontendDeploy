import {
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  Dialog,
  Box,
} from "@mui/material";
import { useState } from "react";
import { updatePostedBlogAPI } from "../../API/Blogs.js";
import styles from "./PostedBlogs.module.css";

const ViewLinks = ({ onClose, walletId, data }) => {
  const [socialLinks, setSocialLinks] = useState({
    facebookLink: data.facebookurl,
    linkedinLink: data.linkedinurl,
    mediumLink: data.mediumurl,
    twitterLink: data.twitterurl,
  });
  const setData = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };
  const submitData = async () => {
    const saved = await updatePostedBlogAPI(walletId, {
      ...socialLinks,
      blogId: data.id,
    });
    if (saved) onClose(saved);
  };
  return (
    <Dialog open>
      <DialogTitle>Blog Links</DialogTitle>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        className={styles.saveLinksBox}
      >
        <Box>
          <TextField
            label="Facebook"
            value={socialLinks.facebookLink}
            onChange={(e) => setData("facebookLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="Medium"
            value={socialLinks.mediumLink}
            onChange={(e) => setData("mediumLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="LinkedIn"
            value={socialLinks.linkedinLink}
            onChange={(e) => setData("linkedinLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="Twitter"
            value={socialLinks.twitterLink}
            onChange={(e) => setData("twitterLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
      </Box>
      <DialogActions>
        <Button autoFocus onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button onClick={submitData} autoFocus variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ViewLinks;
