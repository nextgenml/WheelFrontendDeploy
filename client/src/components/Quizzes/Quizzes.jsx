import { Button } from "@mui/material";
import { useState } from "react";
import config from "../../config";

const Quizzes = () => {
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
    <>
      <Button variant="contained" component="label">
        Select CSV
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
    </>
  );
};
export default Quizzes;
