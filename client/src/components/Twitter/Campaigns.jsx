import { Button, Box } from "@mui/material";
import { useState } from "react";
import CampaignForm from "./CampaignForm";
import { useAccount } from "wagmi";
import CampaignsList from "./CampaignsList";
import styles from "./Twitter.module.css";
import CampaignStats from "./CampaignStats";
const Campaigns = () => {
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const { address } = useAccount();
  const [selectedRow, setSelectedRow] = useState(null);
  const [count, setCount] = useState(0);
  return (
    <Box textAlign={"center"} className={styles.mainForm}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create New Campaign
      </Button>
      {open && (
        <CampaignForm
          record={selectedRow}
          onClose={() => {
            setOpen(false);
            setSelectedRow(null);
          }}
          address={address}
          onSave={() => {
            setCount((prev) => prev + 1);
            localStorage.removeItem("twitter_promotions");
            setOpen(false);
          }}
        />
      )}
      <CampaignsList
        address={address}
        count={count}
        onSelectRow={(row) => {
          setSelectedRow(row);
          setOpen(true);
        }}
        onStatsRow={(row) => {
          setSelectedRow(row);
          setOpenStats(true);
        }}
      />
      {openStats && (
        <CampaignStats
          handleClose={() => {
            setOpenStats(false);
            setSelectedRow(null);
          }}
          campaign={selectedRow}
        />
      )}
    </Box>
  );
};

export default Campaigns;
