/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import styles from "./Quizzes.module.css";

import { useEffect, useState, useRef } from "react";
import config from "../../config.js";
import { useAccount } from "wagmi";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loading from "../loading";
import Questions from "./Questions";

const Quizzes = () => {
  const { isConnected, address } = useAccount();
  const [tabValue, setTabValue] = useState("1");
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState();
  const [quizzes, setQuizzes] = useState();
  const [width, setWidth] = useState(window.innerWidth);

  const fetchQuizzes = async () => {
    const res1 = await fetch(
      `${config.API_ENDPOINT}/quizzes?wallet_id=${address}`
    );
    const data1 = await res1.json();
    setQuizzes(data1);
  };
  const fetchData = async (submission) => {
    const res = await fetch(
      `${config.API_ENDPOINT}/quizzes-by-level?level=${tabValue}&wallet_id=${address}`
    );
    const data = await res.json();
    setQuizData(data);

    // if (submission) fetchQuizzes();
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  const renderContent = () => {
    return (
      <>
        <Box display={"flex"} alignItems="center">
          <Typography variant="h4" className={styles.heading}>
            Quizzes
          </Typography>
          {quizzes.total_reward > 0 && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              Total reward $({quizzes.total_reward})
            </Typography>
          )}
        </Box>

        <TabContext value={tabValue} sx={{ mt: 4 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              maxWidth: isMobile ? { xs: 400, md: 480 } : {},
              bgcolor: "background.paper",
            }}
          >
            <TabList
              onChange={(e, newValue) => setTabValue(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              allowScrollButtonsMobile
            >
              {quizzes.quizzes &&
                quizzes.quizzes.map((quiz, index) => {
                  return (
                    <Tab
                      label={`Level ${quiz.level} (${quiz.reward || 0})`}
                      value={quiz.level.toString()}
                      key={index}
                    />
                  );
                })}
            </TabList>
          </Box>

          {quizzes.quizzes &&
            quizzes.quizzes.map((quiz, index) => {
              return (
                <TabPanel value={quiz.level.toString()} key={index}>
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
