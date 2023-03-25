import {
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  Dialog,
  Box,
} from "@mui/material";
import { useState } from "react";
import { saveSocialLinksAPI } from "../../API/Holder.js";
import styles from "./Header.module.css";
const SaveSocialLinks = ({ onClose, links, walletId }) => {
  const [socialLinks, setSocialLinks] = useState(links);
  const setData = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };
  const submitData = async () => {
    const saved = await saveSocialLinksAPI(walletId, socialLinks);
    if (saved) onClose(saved);
  };
  return (
    <Dialog open>
      <DialogTitle>Social Links</DialogTitle>
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
            placeholder="https://facebook.com/<@handle>"
            value={socialLinks.facebookLink}
            onChange={(e) => setData("facebookLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="Medium"
            placeholder="https://medium.com/<@handle>"
            value={socialLinks.mediumLink}
            onChange={(e) => setData("mediumLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="LinkedIn"
            placeholder="https://linkedin.com/<@handle>"
            value={socialLinks.linkedinLink}
            onChange={(e) => setData("linkedinLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="Twitter"
            placeholder="https://twitter.com/<@handle>"
            value={socialLinks.twitterLink}
            onChange={(e) => setData("twitterLink", e.target.value)}
            className={styles.inputLink}
          />
        </Box>
        <Box>
          <TextField
            label="Telegram"
            placeholder="https://telegram.com/<@handle>"
            value={socialLinks.telegramLink}
            onChange={(e) => setData("telegramLink", e.target.value)}
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
export default SaveSocialLinks;
