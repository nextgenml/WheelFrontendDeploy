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
} from "@mui/material";
import styles from "./Campaigns.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useState } from "react";
const Campaigns = () => {
  const [formData, setFormData] = useState({
    media: [],
  });

  const onFilesChange = (e) => {
    const tempFiles = e.target.files;
    setFormData((prev) => ({
      ...prev,
      files: tempFiles,
    }));
  };

  return (
    <div className={styles.main}>
      <Grid container spacing={2} className={styles.form}>
        <Grid item md={6} xs={12}>
          <TextField
            id="outlined-basic"
            label="Client"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            id="outlined-basic"
            label="Campaign Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Success factor</InputLabel>
            <Select label="Success factor">
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="better">Better</MenuItem>
              <MenuItem value="best">Best</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <MobileDatePicker
                label="Start Time"
                inputFormat="MM/DD/YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        <Grid item md={6} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <MobileDatePicker
                label="End Time"
                inputFormat="MM/DD/YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            id="outlined-basic"
            label="Campaign Content"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button variant="contained" component="label">
            Upload Campaigns images
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
              Optional. You can upload images that to be shared to along with
              post.
            </Typography>
          )}
          {formData.files && formData.files.length > 3 && (
            <Typography variant="caption" color="error">
              Maximum of 3 files can be uploaded
            </Typography>
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Media</InputLabel>
            <Select
              label="Media"
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
      </Grid>
    </div>
  );
};
export default Campaigns;
