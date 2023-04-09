import {
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  Dialog,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { saveSocialLinksAPI } from "../../API/Holder.js";
import styles from "./Header.module.css";
const SaveSocialLinks = ({ onClose, walletId, inviteCode, links }) => {
  const [socialLinks, setSocialLinks] = useState({
    facebookLink:
      localStorage.getItem(`${walletId}_facebookLink`) || links.facebookLink,
    linkedinLink:
      localStorage.getItem(`${walletId}_linkedinLink`) || links.linkedinLink,
    mediumLink:
      localStorage.getItem(`${walletId}_mediumLink`) || links.mediumLink,
    telegramLink:
      localStorage.getItem(`${walletId}_telegramLink`) || links.telegramLink,
    twitterLink:
      localStorage.getItem(`${walletId}_twitterLink`) || links.twitterLink,
    inviteCode,
  });
  const setData = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
    localStorage.setItem(`${walletId}_${key}`, value);
  };
  const submitData = async () => {
    const saved = await saveSocialLinksAPI(walletId, socialLinks);
    if (saved) onClose(saved);
  };
  return (
    <Dialog open>
      <DialogTitle>Social Links</DialogTitle>
      <Box>
        <Typography variant="body2" className={styles.subtitle}>
          *** To view point rewards, please fill all details.
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          This step is important to order to get paid in the website. So please
          complete this step before browsing the website
        </Typography>
      </Box>
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
            placeholder="<@handle>"
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
