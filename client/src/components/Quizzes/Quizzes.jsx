/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import styles from "./Quizzes.module.css";

import { useEffect, useState } from "react";
import config from "../../config.js";
import { useAccount } from "wagmi";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loading from "../loading";
import Questions from "./Questions";

const levels = [
  {
    name: "Level 1",
    value: 1,
  },
  {
    name: "Level 2",
    value: 2,
  },
  {
    name: "Level 3",
    value: 3,
  },
  {
    name: "Level 4",
    value: 4,
  },
  {
    name: "Level 5",
    value: 5,
  },
];
const Quizzes = () => {
  const { isConnected, address } = useAccount();
  const [tabValue, setTabValue] = useState("1");
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState();

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/quizzes-by-level?level=${tabValue}&wallet_id=${address}`
    );
    const data = await res.json();
    setQuizData(data);
    setLoading(false);
  };

  const renderContent = () => {
    return (
      <>
        <Typography variant="h4" className={styles.heading}>
          Quizzes
        </Typography>
        <TabContext value={tabValue} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              {levels.map((level, index) => {
                return (
                  <Tab
                    label={level.name}
                    value={level.value.toString()}
                    key={index}
                  />
                );
              })}
            </TabList>
          </Box>

          {levels.map((level, index) => {
            return (
              <TabPanel value={level.value.toString()} key={index}>
                <Questions
                  quiz={quizData}
                  walletId={address}
                  fetchData={fetchData}
                />
              </TabPanel>
            );
          })}
        </TabContext>
      </>
    );
  };
  return (
    <div className={styles.main}>
      {isConnected ? (
        <>{!loading ? renderContent() : <Loading loading />}</>
      ) : (
        <Typography variant="h6" sx={{ mb: 20 }}>
          Please connect your wallet
        </Typography>
      )}
    </div>
  );
};
export default Quizzes;
