import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChoresLevel from "./ChoresLevel";
import styles from "./Chores.module.css";
import Loading from "../../loading";
import { LoadingButton } from "@mui/lab";
import { getAPICall, writeAPICall } from "../../../API";
import config from "../../../config";
import { useAccount } from "wagmi";
const Chores = () => {
  const { address } = useAccount();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [computing, setComputing] = useState(false);
  const levels = [
    { level: 1, completed: 20, assigned: 25 },
    { level: 2, completed: 19, assigned: 300 },
  ];
  const fetchCampaigns = async () => {
    const res = await getAPICall(
      `${config.API_ENDPOINT}/api/v1/twitter/campaigns/active`
    );
    setCampaigns(res.data);
  };

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
            return <ChoresLevel level={level} />;
          })}
      </List>
    </Box>
  );
};

export default Chores;
