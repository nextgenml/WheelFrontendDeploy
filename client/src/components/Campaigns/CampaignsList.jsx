/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import config from "../../config";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import styles from "./Campaigns.module.css";

const headers = ["Name", "Success factor", "Media", "Start Time", "End Time"];

export default function CampaignsList({ address }) {
  const [campaigns, setCampaigns] = React.useState([]);

  const fetchData = async () => {
    const res1 = await fetch(
      `${config.API_ENDPOINT}/campaigns?walletId=${address}`
    );
    const data = await res1.json();
    setCampaigns(data.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onUpdate = async (action, campaignId) => {
    const res = await fetch(
      `${config.API_ENDPOINT}/update-campaign?walletId=${address}&userAction=${action}&campaignId=${campaignId}`,
      {
        method: "POST",
      }
    );
    if (res.ok) {
      alert(action === "disable" ? "Campaign disabled" : "Campaign enabled");
    } else {
      const error = await res.json();
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
    }
    const currentCampaign = campaigns.filter((p) => p.id === campaignId)[0];
    currentCampaign.is_active = action === "disable" ? 0 : 1;
    console.log("campaigns", campaigns);
    setCampaigns([...campaigns]);
  };
  console.log("re rendering campaigns", campaigns);
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" className={styles.campaignsTableHeader}>
        Saved Campaigns
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((h) => {
              return <TableCell>{h}</TableCell>;
            })}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: row.is_active ? "" : "#FFCCCB",
              }}
            >
              <TableCell>{row.campaign}</TableCell>
              <TableCell>{row.success_factor}</TableCell>
              <TableCell>{row.media}</TableCell>
              <TableCell>
                {moment(row.start_time).format("YYYY-MM-DD")}
              </TableCell>
              <TableCell>{moment(row.end_time).format("YYYY-MM-DD")}</TableCell>
              <TableCell>
                {row.is_active ? (
                  <Button
                    color="error"
                    onClick={() => onUpdate("disable", row.id)}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    onClick={() => onUpdate("enable", row.id)}
                    color="success"
                  >
                    Enable
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
