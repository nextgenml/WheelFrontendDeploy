import { Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import config from "../../config";
import styles from "./Profile.module.css";

const Profile = () => {
  const [file, setFile] = useState();

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const onSubmit = async () => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`${config.API_ENDPOINT}/upload-quizzes`, {
      method: "POST",
      body,
    });
    if (res.ok) {
      alert("Quiz uploaded successfully");
    } else {
      alert("Quiz upload failed");
    }
  };
  return (
    <Box className={styles.main}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Upload quizzes here
      </Typography>
      <Button variant="contained" component="label" sx={{ mr: 2 }}>
        {file ? "File selected" : "Select CSV"}
        <input
          type="file"
          multiple
          name="quiz-csv"
          accept=".csv"
          hidden
          onChange={onFileChange}
        />
      </Button>
      <Button variant="outlined" onClick={onSubmit}>
        Submit
      </Button>
    </Box>
  );
};
export default Profile;
