import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Button,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormGroup,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styles from "./Twitter.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useEffect, useState } from "react";
import config from "../../config.js";
import moment from "moment";
import { writeAPICall } from "../../API";
import useIsMobile from "../../Utils/Mobile";

const CampaignStats = ({ handleClose, campaign }) => {
  const headers = ["Level", "Expected", "Achieved", "Status"];
  const [stats, setStats] = useState([]);
  const isMobile = useIsMobile();
  return (
    <>
      <Dialog fullScreen={isMobile} open onClose={() => {}}>
        <DialogTitle>Stats of Campaign: {campaign.name}</DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Paper sx={{ mb: 2 }}>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table
                sx={{ m: 2, mr: 0, width: "93%" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "var(--bs-gray-300)" }}>
                    {headers.map((h) => {
                      return <TableCell>{h}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{row.level}</TableCell>
                      <TableCell>{row.expected}</TableCell>
                      <TableCell>{row.achieved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: "200px", paddingRight: "200px" }}>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CampaignStats;
