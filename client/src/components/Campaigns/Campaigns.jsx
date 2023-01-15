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
} from "@mui/material";
import styles from "./Campaigns.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import config from "../../config.js";
import draftToHtml from "draftjs-to-html";
import moment from "moment";

const Campaigns = () => {
  const initialState = {
    media: [],
    start_time: moment().format(),
    end_time: moment().format(),
  };
  const [formData, setFormData] = useState(initialState);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onFilesChange = (e) => {
    const tempFiles = e.target.files;
    setFormData((prev) => ({
      ...prev,
      files: tempFiles,
    }));
  };
  const onEditorStateChange = (e) => {
    console.log("changed", e);
    setEditorState(e);
  };
  const onFormDataChange = (newValue, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };
  const onSubmit = async () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log("formdata", formData, content);
    if (
      !formData.media ||
      !formData.client ||
      !formData.campaign_name ||
      !formData.success_factor ||
      !formData.start_time ||
      !formData.end_time ||
      !content
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

    body.append("content", content);
    const res = await fetch(`${config.API_ENDPOINT}/save-campaign`, {
      method: "POST",
      body,
    });
    if (res.ok) {
      setSuccess("Campaign saved successfully");
      setFormData(initialState);
      setError("");
    } else {
      setError("Something went wrong. Please try again after sometime");
      setSuccess("");
    }
  };
  return (
    <div className={styles.main}>
      <Typography variant="h4" className={styles.heading}>
        Enter campaign details
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
            onChange={(e) => onFormDataChange(e.target.value, "campaign_name")}
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

          <Editor
            editorState={editorState}
            toolbarClassName={styles.toolbarMain}
            wrapperClassName="wrapperClassName"
            editorClassName={styles.editorMain}
            onEditorStateChange={onEditorStateChange}
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

        <Grid item md={6} xs={12} sx={{ textAlign: "right" }}>
          <Button variant="contained" component="label" onClick={onSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default Campaigns;
