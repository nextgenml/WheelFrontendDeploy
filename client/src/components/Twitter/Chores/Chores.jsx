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
const Chores = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const levels = [1, 2, 3];
  const fetchData = () => {};
  useEffect(() => {
    fetchData();
  }, [selectedCampaign]);
  return (
    <Box className={styles.mainBox} textAlign={"center"}>
      <FormControl sx={{ width: "300px" }}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCampaign}
          label="Age"
          onChange={(e) => setSelectedCampaign(e.target.value)}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <List>
        {levels &&
          levels.map((rec) => {
            return <ChoresLevel />;
          })}
      </List>
    </Box>
  );
};

export default Chores;
