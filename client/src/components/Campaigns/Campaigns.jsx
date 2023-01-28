/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  Typography,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styles from "./Campaigns.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useEffect, useState } from "react";
import config from "../../config.js";
import moment from "moment";
import { useAccount } from "wagmi";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { fetchBalance } from "@wagmi/core";
import CampaignsList from "./CampaignsList";

const initialState = {
  media: [],
  client: "",
  campaign_name: "",
  success_factor: "best",
  start_time: moment().format(),
  end_time: moment().format(),
  content: "",
  default: false,
};
const Campaigns = () => {
  const { isConnected, address } = useAccount();

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [balance, setBalance] = useState("");

  const updateBalance = async () => {
    const balance = await fetchBalance({
      address: address,
    });
    setBalance(balance);
  };
  useEffect(() => {
    if (address) updateBalance();
  }, [address]);

  const onFilesChange = (e) => {
    const tempFiles = e.target.files;
    setFormData((prev) => ({
      ...prev,
      files: tempFiles,
    }));
  };

  const onFormDataChange = (newValue, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const onSubmit = async () => {
    // const allowedLimit = allowedContentSize(formData.media);
    // if (formData.content.length > allowedLimit) {
    //   setError(
    //     `Length of campaign content cannot be more than ${allowedLimit}`
    //   );
    //   return;
    // }
    if (
      !formData.media ||
      !formData.client ||
      !formData.campaign_name ||
      !formData.success_factor ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.content
    ) {
      setError("Please fill all mandatory fields *");
      return;
    }

    const body = new FormData();
    for (const name in formData) {
      if (name !== "files") body.append(name, formData[name]);
    }

    if (formData.files && formData.files.length)
      Array.from(formData.files).forEach((file, i) => {
        body.append(`file-${i}`, file, file.name);
      });
    body.append("wallet_id", address);
    const res = await fetch(`${config.API_ENDPOINT}/save-campaign`, {
      method: "POST",
      body,
    });
    if (res.ok) {
      alert("Campaign saved successfully");
      // setSuccess("Campaign saved successfully");
      setFormData(initialState);
      // setError("");
    } else {
      const error = await res.json();
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
      // setError(
      //   error.message || "Something went wrong. Please try again after sometime"
      // );
      // setSuccess("");
    }
  };

  const renderForm = () => {
    if (
      !balance ||
      parseInt(balance.formatted) < config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN
    )
      return (
        <Typography variant="h6" sx={{ mb: 20 }}>
          Minimum {config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN} tokens required
          to create a campaign
        </Typography>
      );
    return (
      <>
        <Typography variant="h4" className={styles.heading}>
          Enter new campaign details
        </Typography>
        <Grid container spacing={2} className={styles.form}>
          {error && (
            <Grid item md={12} xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {success && (
            <Grid item md={12} xs={12}>
              <Alert severity="success">{success}</Alert>
            </Grid>
          )}
          <Grid item md={6} xs={12}>
            <TextField
              id="outlined-basic"
              label="Client*"
              variant="outlined"
              fullWidth
              value={formData.client}
              onChange={(e) => onFormDataChange(e.target.value, "client")}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              id="outlined-basic"
              label="Campaign Name*"
              variant="outlined"
              fullWidth
              value={formData.campaign_name}
              onChange={(e) =>
                onFormDataChange(e.target.value, "campaign_name")
              }
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Success factor*</InputLabel>
              <Select
                label={"Success factor*"}
                value={formData.success_factor}
                onChange={(e) =>
                  onFormDataChange(e.target.value, "success_factor")
                }
              >
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="better">Better</MenuItem>
                <MenuItem value="best">Best</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Media*</InputLabel>
              <Select
                label="Media*"
                multiple
                value={formData.media}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    media:
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value,
                  }))
                }
              >
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDatePicker
                  label="Start Time*"
                  disablePast
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} />}
                  value={formData.start_date}
                  onChange={(value) => onFormDataChange(value, "start_date")}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item md={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDatePicker
                  label="End Time*"
                  disablePast
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} />}
                  value={formData.end_date}
                  onChange={(value) => onFormDataChange(value, "end_date")}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>

          <Grid item md={12} xs={12}>
            <InputLabel sx={{ mb: 1 }}>Campaign Content*</InputLabel>

            <RichTextEditor
              onChange={(content) => onFormDataChange(content, "content")}
              initialHtml=""
              readOnly={false}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Button variant="contained" component="label">
              Upload Campaign images
              <input
                type="file"
                multiple
                name="screenshots"
                accept=".png,.jpg"
                hidden
                onChange={onFilesChange}
              />
            </Button>
            {formData.files && formData.files.length ? (
              Array.from(formData.files).map((file) => (
                <Typography variant="body2">{file.name}</Typography>
              ))
            ) : (
              <Typography variant="body2">
                Optional. You can upload images that to be shared along with the
                post.
              </Typography>
            )}
            {formData.files && formData.files.length > 3 && (
              <Typography variant="caption" color="error">
                Maximum of 3 files can be uploaded
              </Typography>
            )}
          </Grid>

          <Grid item md={3} xs={12}>
            {address === config.ADMIN_WALLET && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.default}
                      onChange={(e) =>
                        onFormDataChange(e.target.checked, "default")
                      }
                    />
                  }
                  label="Default Campaign"
                />
              </FormGroup>
            )}
          </Grid>

          <Grid item md={3} xs={12} sx={{ textAlign: "right" }}>
            <Button variant="contained" component="label" onClick={onSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
        <CampaignsList address={address} />
      </>
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
export default Campaigns;
