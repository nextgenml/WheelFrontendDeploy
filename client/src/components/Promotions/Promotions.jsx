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
import styles from "./Promotions.module.css";
import { useEffect, useState } from "react";
import config from "../../config.js";
import { useAccount } from "wagmi";
import PromotionsList from "./PromotionsList";

const initialState = {
  eth_amount: 0,
  overall_promotions_limit: null,
  blogs_limit: null,
};
const BLOG_OPTIONS = [50, 100, 150];
const PROMOTION_OPTIONS = [100, 200, 300];
const PRICE_MAPPING = {
  "50_100": 1,
  "50_200": 1,
  "50_300": 1,
  "100_100": 2,
  "100_200": 2,
  "100_300": 2,
  "150_100": 3,
  "150_200": 3,
  "150_300": 3,
};
const Promotions = () => {
  const { isConnected, address } = useAccount();

  const [formData, setFormData] = useState(initialState);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (formData.blogs_limit && formData.overall_promotions_limit)
      onFormDataChange(
        PRICE_MAPPING[
          `${formData.blogs_limit}_${formData.overall_promotions_limit}`
        ],
        "eth_amount"
      );
  }, [formData.overall_promotions_limit, formData.blogs_limit]);
  const onFormDataChange = (newValue, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const onSubmit = async () => {
    if (
      !formData.eth_amount ||
      !formData.overall_promotions_limit ||
      !formData.blogs_limit
    ) {
      alert("Please enter all mandatory fields");
      return;
    }
    formData.payer_wallet_id = address;
    formData.receiver_wallet_id = config.PROMOTIONS_RECEIVER_WALLET;

    const res = await fetch(`${config.API_ENDPOINT}/save-promotion`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      alert("Admin will verify and approve the request");
      setFormData(initialState);
      setCount((prev) => prev + 1);
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };

  const renderForm = () => {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" className={styles.heading}>
          Enter Promotion Details
        </Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          Receiver Wallet: <b>{config.PROMOTIONS_RECEIVER_WALLET}</b>
        </Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          Your Wallet: <b>{address}</b>
        </Typography>
        <Grid container spacing={2} className={styles.form}>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel>No of blogs*</InputLabel>
              <Select
                label={"No of blogs*"}
                value={formData.blogs_limit}
                onChange={(e) =>
                  onFormDataChange(e.target.value, "blogs_limit")
                }
              >
                {BLOG_OPTIONS.map((b) => (
                  <MenuItem value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth>
              <InputLabel>No of overall promotions*</InputLabel>
              <Select
                label={"No of overall promotions*"}
                value={formData.overall_promotions_limit}
                onChange={(e) =>
                  onFormDataChange(e.target.value, "overall_promotions_limit")
                }
              >
                {PROMOTION_OPTIONS.map((b) => (
                  <MenuItem value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={2} xs={6}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              disabled
              value={formData.eth_amount}
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
        <PromotionsList address={address} count={count} />
      </Box>
    );
  };
  return (
    <div className={styles.main}>
      {isConnected ? (
        renderForm()
      ) : (
        <Typography variant="h6" sx={{ mb: 20 }}>
          Please connect your wallet
        </Typography>
      )}
    </div>
  );
};
export default Promotions;
