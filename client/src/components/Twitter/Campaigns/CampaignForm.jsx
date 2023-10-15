/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Button,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormGroup,
  Checkbox,
} from "@mui/material";
import styles from "./Campaigns.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useEffect, useState } from "react";
import config from "../../../config.js";
import moment from "moment";
import { writeAPICall } from "../../../API";

const getLocalCopy = () => {
  return JSON.parse(localStorage.getItem("twitter_promotions") || "{}");
};
const CampaignForm = ({ record, onClose, address, onSave }) => {
  const localCopy = record || getLocalCopy();
  const initialState = {
    name: localCopy.name,
    level_1_end_date: moment(localCopy.level_1_end_date || undefined),
    level_2_end_date: moment(localCopy.level_2_end_date || undefined),
    level_3_end_date: moment(localCopy.level_3_end_date || undefined),
    level_4_end_date: moment(localCopy.level_4_end_date || undefined),
    level_5_end_date: moment(localCopy.level_5_end_date || undefined),
    content: localCopy.content || "",
    no_of_users: localCopy.no_of_users,
    no_of_levels: localCopy.no_of_levels || 1,
    tweet_link: localCopy.tweet_link || "",
    hash_tags: localCopy.hash_tags || "",
  };
  const [active, setActive] = useState(!localCopy.deleted_at);

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const [levels, setLevels] = useState([
    {
      key: "level_1_end_date",
      posts: 0,
      level: 1,
      label: "Level 1",
    },
    {
      key: "level_2_end_date",
      posts: 0,
      level: 2,
      label: "Level 2",
    },
    {
      key: "level_3_end_date",
      posts: 0,
      level: 3,
      label: "Level 3",
    },
    {
      key: "level_4_end_date",
      posts: 0,
      level: 4,
      label: "Level 4",
    },
    {
      key: "level_5_end_date",
      posts: 0,
      level: 5,
      label: "Level 5",
    },
  ]);

  useEffect(() => {
    updateLevels(formData.no_of_users);
  }, []);
  const onFormDataChange = (newValue, key) => {
    const localCopy = getLocalCopy();
    localCopy[key] = newValue;
    localStorage.setItem("twitter_promotions", JSON.stringify(localCopy));
    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const onSubmit = async () => {
    Object.keys(formData).forEach((key) => {
      if (key.endsWith("_date")) formData[key] = moment(formData[key]).format();
    });
    levels.forEach((level) => {
      formData[`level_${level.level}_target`] = level.posts;
    });
    formData.active = active ? 1 : 0;

    if (
      !formData.name ||
      !formData.content ||
      !formData.no_of_users ||
      !formData.no_of_levels ||
      !formData.hash_tags
    ) {
      alert("Please fill all mandatory fields *");
      return;
    }

    setDisableSubmit(true);
    let res = null;
    if (localCopy.id > 0) {
      res = await writeAPICall(
        `${config.API_ENDPOINT}/api/v1/twitter/campaigns/${localCopy.id}?walletId=${address}`,
        formData,
        "PUT"
      );
    } else {
      res = await writeAPICall(
        `${config.API_ENDPOINT}/api/v1/twitter/campaigns?walletId=${address}`,
        formData
      );
    }

    if (!res) {
      alert("Something went wrong. Please try again after sometime");
    } else {
      onSave();
    }
    setDisableSubmit(false);
  };

  const updateLevels = (noOfUsers) => {
    noOfUsers = parseInt(noOfUsers) || 0;

    const newLevels = [...levels];

    newLevels.forEach((record) => {
      record.posts =
        noOfUsers > 0
          ? record.level > 1
            ? noOfUsers * Math.pow(noOfUsers - 1, record.level - 1)
            : noOfUsers
          : 0;
    });

    setLevels(newLevels);
  };
  const handleClose = () => {
    onClose();
  };

  const renderForm = () => {
    return (
      <>
        <Dialog
          fullScreen
          open
          onClose={() => {}}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Campaign Form</DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <Grid container spacing={2} className={styles.form}>
              <Grid item md={6} xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Name*"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => onFormDataChange(e.target.value, "name")}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  id="outlined-basic"
                  label="No of Users*"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={formData.no_of_users}
                  onChange={(e) => {
                    onFormDataChange(e.target.value, "no_of_users");
                    updateLevels(e.target.value);
                  }}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <FormControl>
                  <RadioGroup
                    value={formData.no_of_levels.toString()}
                    row
                    onChange={(e, value) =>
                      onFormDataChange(value, "no_of_levels")
                    }
                  >
                    {levels.map((record) => {
                      return (
                        <Box
                          sx={{
                            ml: 1,
                            mt: 3,
                            p: 2,
                            border: "1px solid lightgrey",
                            borderRadius: "8px",
                          }}
                        >
                          <FormControlLabel
                            value={record.level.toString()}
                            id={record.key}
                            control={<Radio />}
                            label={record.label}
                          />
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <b>Posts:&nbsp;&nbsp;</b>
                            {record.posts}
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              label="Level Target Time*"
                              disablePast
                              inputFormat="DD/MM/YYYY"
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              value={formData[record.key]}
                              onChange={(value) =>
                                onFormDataChange(value, record.key)
                              }
                            />
                          </LocalizationProvider>
                        </Box>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12}>
                <InputLabel sx={{ mb: 1 }}>Campaign/Tweet Content*</InputLabel>
                <TextField
                  multiline
                  fullWidth
                  rows={4}
                  value={formData.content}
                  onChange={(e) => onFormDataChange(e.target.value, "content")}
                  inputProps={{ maxLength: 280 }}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <InputLabel sx={{ mb: 1 }}>
                  Hashtags* (Please provide tags separated by new lines)
                </InputLabel>
                <TextField
                  multiline
                  fullWidth
                  rows={4}
                  value={formData.hash_tags}
                  onChange={(e) =>
                    onFormDataChange(e.target.value, "hash_tags")
                  }
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <InputLabel sx={{ mb: 1 }}>Tweet Link (Optional).</InputLabel>
                <TextField
                  fullWidth
                  value={formData.tweet_link}
                  onChange={(e) =>
                    onFormDataChange(e.target.value, "tweet_link")
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ paddingLeft: "200px", paddingRight: "200px" }}>
            {localCopy.id > 0 && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={active}
                      onChange={(e) => {
                        setActive(e.target.checked);
                      }}
                    />
                  }
                  label="Active"
                />
              </FormGroup>
            )}

            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
            <Button
              variant="contained"
              disabled={disableSubmit}
              component="label"
              onClick={onSubmit}
              sx={{ ml: 2 }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  return <div className={styles.main}>{renderForm()}</div>;
};
export default CampaignForm;
