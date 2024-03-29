/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, TextField, Typography, Card, Button, Box } from "@mui/material";
import styles from "./MovieTickets.module.css";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { customFetch } from "../../API";
import config from "../../config";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs from "dayjs";
import Countdown from "react-countdown";

const NextMovieForm = ({ meta, getMeta }) => {
  const [searchParams, _] = useSearchParams();
  const { address } = useAccount();

  const initialState = {
    movieTime: localStorage.getItem("movieTime") || dayjs(),
    movieName: localStorage.getItem("movieName") || "",
  };
  const [formData, setFormData] = useState(initialState);
  const [latestMovie, setLatestMovie] = useState();
  const [imageErrors, setImageErrors] = useState({});
  const [complete, setComplete] = useState(false);
  const onFormDataChange = (newValue, key) => {
    localStorage.setItem(key, newValue);

    setFormData((prev) => ({ ...prev, [key]: newValue }));
  };
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    getNewMovie();
  }, []);
  const getNewMovie = async () => {
    const res = await customFetch(
      `${config.API_ENDPOINT}/api/v1/movie-tickets/movies/latest?viewAs=${
        searchParams.get("viewAs") || ""
      }&walletId=${address}`
    );
    if (res.ok) {
      const { data } = await res.json();
      setLatestMovie(data);
      setFormData((prev) => ({
        ...prev,
        movieName: data?.movie_name || "",
        movieTime: dayjs(data?.movie_time),
      }));
    } else {
      alert("Something went wrong. Please try again after sometime");
    }
  };

  const onSubmit = async () => {
    console.log("formData", formData);
    if (!formData.movieTime || !formData.movieName) {
      alert("Please enter all fields to continue");
      return;
    }

    setDisableSubmit(true);
    const body = new FormData();
    for (const name in formData) {
      if (name.includes("_image")) {
        console.log("formData[name]", formData[name]);
        body.append(
          `${name}_date`,
          moment(formData[name].lastModifiedDate).utc().format()
        );
      }
      if (name === "movieTime")
        body.append(name, dayjs(formData[name]).format());
      else body.append(name, formData[name]);
    }

    let res;
    if (latestMovie?.id > 0) {
      res = await customFetch(
        `${config.API_ENDPOINT}/api/v1/movie-tickets/movies/${latestMovie.id}?walletId=${address}`,
        {
          method: "PUT",
          body,
        }
      );
    } else {
      res = await customFetch(
        `${config.API_ENDPOINT}/api/v1/movie-tickets/movies?walletId=${address}`,
        {
          method: "POST",
          body,
        }
      );
    }

    if (res.ok) {
      const { isComplete } = await res.json();
      setComplete(isComplete);
      alert("Saved Successfully");
      localStorage.removeItem("movieTime");
      localStorage.removeItem("movieName");
      setImageErrors({});
      getNewMovie();
      getMeta();
      setFormData(initialState);
    } else {
      const { errors } = await res.json();
      setImageErrors(errors);
    }
    setDisableSubmit(false);
  };
  const onFilesChange = (e, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.files[0],
    }));
  };

  if (complete)
    return (
      <div className={styles.main}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Card elevation={1} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                className={styles.subHeading}
                sx={{ textAlign: "center", mb: 2 }}
              >
                Next Movie details
              </Typography>

              <Box sx={{ p: 1 }}>
                <CheckCircleOutlineIcon fontSize="large" color="success" />{" "}
                Movie details are successfully submitted. System will verify the
                details and release the funds shortly
              </Box>

              <Box textAlign={"center"} sx={{ mt: 1 }}>
                <Button variant="contained" onClick={() => setComplete(false)}>
                  Ok
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  return (
    <div className={styles.main}>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Card elevation={1} sx={{ p: 2 }}>
            <Typography
              variant="h6"
              className={styles.subHeading}
              sx={{ textAlign: "center", mb: 2 }}
            >
              <b>Next Movie details</b>
              <Typography>Plan your next movie from {meta.nextPlan}</Typography>
            </Typography>
            <Box
              display={"flex"}
              alignItems={"center"}
              className={styles.timeLeft}
            >
              {latestMovie &&
                Date.now() <
                  Date.parse(latestMovie.movie_time) + 4 * 60 * 60 * 1000 && (
                  <Typography variant="subtitle1">
                    Time left to upload tickets&nbsp;&nbsp;
                  </Typography>
                )}

              <b>
                {latestMovie && latestMovie.movie_time && (
                  <Countdown
                    date={
                      Date.parse(latestMovie.movie_time) + 4 * 60 * 60 * 1000
                    }
                    key={Math.floor(Math.random() * 100)}
                  >
                    <Typography>
                      Time limit exceeded. You cannot upload tickets now
                    </Typography>
                  </Countdown>
                )}
              </b>
            </Box>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Movie Name*"
                  variant="outlined"
                  fullWidth
                  value={formData.movieName}
                  onChange={(e) =>
                    onFormDataChange(e.target.value, "movieName")
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    id="outlined-basic"
                    label="Movie Time in your timezone*"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => <TextField {...params} />}
                    value={formData.movieTime}
                    onChange={(value) => {
                      console.log("value", value);
                      onFormDataChange(value, "movieTime");
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              {meta && meta.enableUpload && latestMovie && latestMovie.id && (
                <>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ borderTop: "1px solid lightgrey", mt: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      color={"danger"}
                      sx={{ mb: 2, color: "orange" }}
                    >
                      All movie tickets should be uploaded within 1 hour before
                      and 3 hours after the movie time
                    </Typography>
                    <Button variant="outlined" component="label">
                      Upload receipt Image
                      <input
                        type="file"
                        name="screenshots"
                        accept=".png,.jpg"
                        hidden
                        onChange={(e) => onFilesChange(e, "ticket_image")}
                      />
                    </Button>
                    {latestMovie?.ticket_image_path && (
                      <CheckCircleOutlineIcon sx={{ ml: 1 }} color="success" />
                    )}
                    {formData.ticket_image && (
                      <Typography variant="caption" sx={{ ml: 2 }}>
                        {formData.ticket_image.name}
                      </Typography>
                    )}

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item md={6}>
                        {formData.ticket_image ||
                        latestMovie?.ticket_image_path ? (
                          <img
                            src={
                              formData.ticket_image
                                ? URL.createObjectURL(formData.ticket_image)
                                : `${
                                    config.API_ENDPOINT
                                  }/${latestMovie.ticket_image_path.replace(
                                    "uploads",
                                    "images"
                                  )}`
                            }
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        ) : (
                          <img
                            src="/movieTickets/ticket.jpeg"
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        )}
                      </Grid>
                      <Grid item md={6}>
                        {imageErrors && imageErrors.ticket_issues
                          ? imageErrors.ticket_issues.map((x, i) => (
                              <Typography color={"var(--bs-danger)"}>
                                {i + 1}. {x}
                              </Typography>
                            ))
                          : latestMovie && (
                              <>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={"bold"}
                                >
                                  Uploaded ticket data
                                </Typography>
                                <Typography variant="subtitle2">
                                  Movie Name: <b>{latestMovie.c_movie_name}</b>
                                </Typography>
                                <Typography variant="subtitle2">
                                  Movie Date: <b>{latestMovie.c_movie_date}</b>
                                </Typography>
                                <Typography variant="subtitle2">
                                  Movie Time: <b>{latestMovie.c_movie_time}</b>
                                </Typography>
                                <Typography variant="subtitle2">
                                  Seat Number:{" "}
                                  <b>{latestMovie.c_seat_number}</b>
                                </Typography>
                                <Typography variant="subtitle2">
                                  Cinema Hall: <b>{latestMovie.c_hall_name}</b>
                                </Typography>
                                <Typography variant="subtitle2">
                                  City: <b>{latestMovie.c_city}</b>
                                </Typography>
                              </>
                            )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ borderTop: "1px solid lightgrey", mt: 1 }}
                  >
                    <Button variant="outlined" component="label">
                      Upload Theater Image
                      <input
                        type="file"
                        accept=".png,.jpg"
                        hidden
                        onChange={(e) => onFilesChange(e, "hall_image")}
                      />
                    </Button>
                    {latestMovie?.hall_image_path && (
                      <CheckCircleOutlineIcon sx={{ ml: 1 }} color="success" />
                    )}
                    {formData.hall_image && (
                      <Typography variant="caption" sx={{ ml: 2 }}>
                        {formData.hall_image.name}
                      </Typography>
                    )}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item md={6}>
                        {formData.hall_image || latestMovie?.hall_image_path ? (
                          <img
                            src={
                              formData.hall_image
                                ? URL.createObjectURL(formData.hall_image)
                                : `${
                                    config.API_ENDPOINT
                                  }/${latestMovie.hall_image_path.replace(
                                    "uploads",
                                    "images"
                                  )}`
                            }
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        ) : (
                          <img
                            src="/movieTickets/theater.jpeg"
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        )}
                      </Grid>
                      <Grid item md={6}>
                        {imageErrors &&
                          imageErrors.hall_image_issues &&
                          imageErrors.hall_image_issues.map((x, i) => (
                            <Typography color={"var(--bs-danger)"}>
                              {i + 1}. {x}
                            </Typography>
                          ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ borderTop: "1px solid lightgrey", mt: 1 }}
                  >
                    <Button variant="outlined" component="label">
                      Upload Movie Posture Image
                      <input
                        type="file"
                        accept=".png,.jpg"
                        hidden
                        onChange={(e) => onFilesChange(e, "posture_image")}
                      />
                    </Button>
                    {latestMovie?.posture_image_path && (
                      <CheckCircleOutlineIcon sx={{ ml: 1 }} color="success" />
                    )}
                    {formData.posture_image && (
                      <Typography variant="caption" sx={{ ml: 2 }}>
                        {formData.posture_image.name}
                      </Typography>
                    )}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item md={6}>
                        {formData.posture_image ||
                        latestMovie?.posture_image_path ? (
                          <img
                            src={
                              formData.posture_image
                                ? URL.createObjectURL(formData.posture_image)
                                : `${
                                    config.API_ENDPOINT
                                  }/${latestMovie.posture_image_path.replace(
                                    "uploads",
                                    "images"
                                  )}`
                            }
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        ) : (
                          <img
                            src="/movieTickets/posture.jpeg"
                            alt="ticket"
                            height={200}
                            width={300}
                          />
                        )}
                      </Grid>
                      <Grid item md={6}>
                        {imageErrors && imageErrors.posture_image_date && (
                          <Typography
                            variant="subtitle2"
                            color={"var(--bs-danger)"}
                          >
                            {imageErrors.posture_image_date}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}

              <Grid item md={12} xs={12}>
                <Button
                  variant="contained"
                  disabled={disableSubmit}
                  component="label"
                  onClick={onSubmit}
                  sx={{ mt: 2 }}
                >
                  SAVE
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
export default NextMovieForm;
