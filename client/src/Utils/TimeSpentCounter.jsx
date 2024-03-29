/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

const TimeSpentCounter = ({ timestamp, className }) => {
  const [seconds, setSeconds] = useState(
    moment().diff(moment.utc(timestamp), "seconds")
  );

  let intervalFunc = null;
  const setFunc = () => {
    intervalFunc = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };
  useEffect(() => {
    setFunc();
    return () => {
      if (intervalFunc) clearInterval(intervalFunc);
    };
  }, []);
  return <Typography className={className}>{seconds}</Typography>;
};

export default TimeSpentCounter;
