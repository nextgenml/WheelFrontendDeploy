/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChoresLevel from "./ChoresLevel";
import styles from "./Chores.module.css";
import { LoadingButton } from "@mui/lab";
import { getAPICall, writeAPICall } from "../../../API";
import config from "../../../config";
import { useAccount } from "wagmi";
const Chores = () => {
  const { address } = useAccount();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [computing, setComputing] = useState(false);
  const [levels, setLevels] = useState([]);

  const fetchCampaigns = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/active`
    );
    setCampaigns(res.data);
  };

  const fetchStats = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/${selectedCampaign}/stats?walletId=${address}`
    );
    setLevels(res.data);
  };
  useEffect(() => {
    if (selectedCampaign) fetchStats();
  }, [selectedCampaign]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const onCompute = async () => {
    setComputing(true);
    try {
      await writeAPICall(
        `${config.API_ENDPOINT}/api/v1/twitter/campaigns/${selectedCampaign}/computeChores?walletId=${address}`
      );
    } catch (error) {
      alert("Server error. Please try again after sometime");
    }

    setComputing(false);
  };
  console.log("selectedCampaign", selectedCampaign);
  return (
    <Box className={styles.mainBox} textAlign={"center"}>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <FormControl sx={{ width: "300px" }}>
          <InputLabel>Select Campaign</InputLabel>
          <Select
            value={selectedCampaign}
            label="Select Campaign"
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            {campaigns.map((c) => (
              <MenuItem value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={onCompute}
          disabled={computing || !selectedCampaign}
          loading={computing}
        >
          Compute my tasks
        </LoadingButton>
      </Box>

      <List sx={{ mt: 2 }}>
        {levels &&
          levels.map((level) => {
            return (
              <ChoresLevel
                level={level}
                campaignId={selectedCampaign}
                address={address}
              />
            );
          })}
      </List>
    </Box>
  );
};

export default Chores;
