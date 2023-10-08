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
const Chores = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const levels = [
    { level: 1, completed: 20, assigned: 25 },
    { level: 2, completed: 19, assigned: 300 },
  ];
  const fetchData = () => {};
  useEffect(() => {
    fetchData();
  }, [selectedCampaign]);
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
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" sx={{ ml: 2 }}>
          Compute my tasks
        </Button>
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
