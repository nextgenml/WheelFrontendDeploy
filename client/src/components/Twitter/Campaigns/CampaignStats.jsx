/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import useIsMobile from "../../../Utils/Mobile";
import { getAPICall } from "../../../API";
import config from "../../../config";

const CampaignStats = ({ handleClose, campaign, address }) => {
  const headers = ["Level", "Status", "Completed", "Target"];
  const [stats, setStats] = useState([]);
  const isMobile = useIsMobile();

  const fetchData = async () => {
    const data = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/${campaign.id}/stats?walletId=${address}`
    );
    setStats(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Dialog fullScreen={isMobile} open onClose={handleClose}>
        <DialogTitle>
          Stats of Campaign: <b>{campaign.name}</b>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Paper sx={{ mb: 2 }}>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table sx={{ m: 2, mr: 0, width: "93%" }}>
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
                        backgroundColor:
                          row.completed >= row.target ? "lightgreen" : "white",
                      }}
                    >
                      <TableCell>{row.level}</TableCell>
                      <TableCell>
                        {row.completed >= row.target ? "Completed" : "Ongoing"}
                      </TableCell>
                      <TableCell>{row.completed}</TableCell>
                      <TableCell>{row.target}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ mb: 5, mr: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CampaignStats;
