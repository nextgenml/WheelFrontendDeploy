/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChoresLevel from "./ChoresLevel";
import styles from "./Chores.module.css";
import { LoadingButton } from "@mui/lab";
import { getAPICall, writeAPICall } from "../../../API";
import config from "../../../config";
import { useAccount } from "wagmi";
import CampaignStats from "../Campaigns/CampaignStats";
import MyStats from "./MyStats";
import { useSearchParams } from "react-router-dom";
const Chores = () => {
  const { address } = useAccount();
  const [selectedCampaign, setSelectedCampaign] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [computing, setComputing] = useState(false);
  const [levels, setLevels] = useState([]);
  const [closeCollapse, setCloseCollapse] = useState(0);
  const [openCampStats, setOpenCampStats] = useState(false);
  const [openMyStats, setOpenMyStats] = useState(false);
  const [searchParams, _] = useSearchParams();

  const fetchCampaigns = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/active`
    );
    setCampaigns(res.data);
    if (!selectedCampaign) setSelectedCampaign(res.data[0].id);
  };

  const fetchStats = async () => {
    const res = await getAPICall(
      `${
        config.API_ENDPOINT
      }/api/v1/twitter/campaigns/${selectedCampaign}/userStats?walletId=${address}&campaigner=${searchParams.get(
        "campaigner"
      )}`
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
      fetchStats();
      setCloseCollapse((prev) => prev + 1);
    } catch (error) {
      alert("Server error. Please try again after sometime");
    }

    setComputing(false);
  };

  return (
    <Box className={styles.mainBox} textAlign={"center"}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        <b>Chores</b>
      </Typography>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        className={styles.selectBox}
      >
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
          variant="contained"
          sx={{ ml: 2 }}
          className={styles.computeButton}
          onClick={onCompute}
          disabled={computing || !selectedCampaign}
          loading={computing}
        >
          Compute my tasks
        </LoadingButton>
      </Box>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ mt: 2 }}
      >
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          className={styles.computeButton}
          onClick={() => setOpenCampStats(true)}
        >
          View Campaign Stats
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          className={styles.computeButton}
          onClick={() => setOpenMyStats(true)}
        >
          View My Stats
        </Button>
      </Box>

      <List sx={{ mt: 2 }}>
        {levels &&
          levels.map((level) => {
            return (
              <ChoresLevel
                level={level}
                campaignId={selectedCampaign}
                address={address}
                closeCollapse={closeCollapse}
              />
            );
          })}
      </List>

      {openCampStats && selectedCampaign && (
        <CampaignStats
          handleClose={() => {
            setOpenCampStats(false);
          }}
          campaign={campaigns.filter((c) => c.id === selectedCampaign)[0]}
          address={address}
        />
      )}

      {openMyStats && selectedCampaign && (
        <MyStats
          handleClose={() => {
            setOpenMyStats(false);
          }}
          campaign={campaigns.filter((c) => c.id === selectedCampaign)[0]}
          address={address}
        />
      )}
    </Box>
  );
};

export default Chores;
