/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import styles from "./AllocationAdmin.module.css";
import { useState } from "react";
import config from "../../config.js";
import { customFetch } from "../../API/index.js";

const initialState = {
  token: null,
  nml_tokens: null,
  winners: null,
};
const tokens = ["volt", "ape", "floki", "elon", "nml"];
const AllocationAdmin = () => {
  const [formData, setFormData] = useState(initialState);

  const onFormDataChange = (newValue, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const onSubmit = async () => {
    if (!formData.token || !formData.nml_tokens || !formData.winners) {
      alert("Please enter all fields");
      return;
    }

    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/tokens/prizes`,
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      alert(
        "Process is initiated. All transfers will be completed in 15-20 mins"
      );
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };

  const renderForm = () => {
    return (
      <Box sx={{ padding: 3, mb: 20 }}>
        <Typography variant="h4" className={styles.heading}>
          Enter token holders prizes
        </Typography>
        <Grid container spacing={2} className={styles.form}>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Token*</InputLabel>
              <Select
                label={"Token*"}
                value={formData.token}
                onChange={(e) => onFormDataChange(e.target.value, "token")}
              >
                {tokens.map((b) => (
                  <MenuItem value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label={"NML tokens"}
              fullWidth
              value={formData.nml_tokens}
              onChange={(e) => onFormDataChange(e.target.value, "nml_tokens")}
            />
          </Grid>
          <Grid item md={2} xs={6}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label={"No of top holders"}
              fullWidth
              value={formData.winners}
              onChange={(e) => onFormDataChange(e.target.value, "winners")}
            />
          </Grid>
          <Grid item md={2} xs={6}>
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 1 }}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };
  return <div className={styles.main}>{renderForm()}</div>;
};
export default AllocationAdmin;
