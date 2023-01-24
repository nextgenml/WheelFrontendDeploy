import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import config from "../../config";
import styles from "./Quizzes.module.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import moment from "moment";

const Questions = ({ quiz, walletId, fetchData }) => {
  const quizData = quiz.data;

  const [answers, setAnswers] = useState({});
  const onSubmit = async () => {
    const body = [];
    let count = 0;
    Object.keys(answers).forEach((id) => {
      if (answers[id]) count += 1;
      body.push({
        id: id,
        user_input: answers[id],
      });
    });
    if (count !== quizData.length) {
      alert("Please answer all questions");
      return;
    }
    const res = await fetch(
      `${config.API_ENDPOINT}/save-quiz-answers?wallet_id=${walletId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: body }),
      }
    );
    if (res.ok) {
      alert("Quiz Submitted successfully");
      fetchData();
    } else {
      alert("Quiz submission failed. Please try again after sometime");
    }
  };
  if (quizData && quizData.length === 0)
    return (
      <div className={styles.tabPanel}>
        <Typography variant="h6" textAlign="center">
          Quiz launches soon
          <RocketLaunchIcon sx={{ color: "var(--bs-purple)", ml: 2 }} />
        </Typography>
      </div>
    );
  return (
    <Box className={styles.tabPanel}>
      <Typography
        variant="h6"
        textAlign="center"
        display={"flex"}
        alignItems="center"
      >
        Questions&nbsp;&nbsp;
        <Tooltip title={"Users who have answered all questions correctly"}>
          <Link
            className={styles.copyIcon}
            onClick={() =>
              navigator.clipboard.writeText(
                quiz.correct_answered_quiz_wallets.join(",")
              )
            }
          >
            <Typography variant="body1">
              Copy wallets ({quiz.correct_answered_quiz_wallets.length})
            </Typography>
          </Link>
        </Tooltip>
      </Typography>
      {quizData &&
        quizData.map((q, index) => {
          return (
            <Box
              display={"flex"}
              alignItems="center"
              className={styles.question}
            >
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {index + 1}.
              </Typography>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {q.question}
              </Typography>
              <TextField
                id="standard-basic"
                variant="standard"
                size="small"
                value={q.user_answer}
                disabled={!!q.user_answer}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [q.id]: e.target.value,
                  }))
                }
                sx={{ mr: 2 }}
              />
              {q.user_answer && (
                <Box>
                  {q.is_correct ? (
                    <Box sx={{ color: "var(--bs-teal)" }}>
                      <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                      <Typography variant="caption">Correct Answer</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ color: "var(--bs-red)" }}>
                      <HighlightOffIcon sx={{ mr: 1 }} />
                      <Typography variant="caption">Wrong Answer</Typography>

                      {moment(q.show_answers_at).diff(moment()) < 0 && (
                        <Typography
                          variant="caption"
                          className={styles.rightAnswer}
                        >
                          Right answer is {q.answer}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
              {q.correct_answered_wallets && (
                <Tooltip
                  title={"Users who have answered this question correctly"}
                >
                  <Link
                    className={styles.copyIcon}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        q.correct_answered_wallets.join(",")
                      )
                    }
                  >
                    Copy wallets ({q.correct_answered_wallets.length})
                  </Link>
                </Tooltip>
              )}
            </Box>
          );
        })}

      {quizData && quizData[0] && !quizData[0].user_answer && (
        <Button
          variant="contained"
          onClick={onSubmit}
          className={styles.submitQuiz}
        >
          Submit Quiz
        </Button>
      )}
    </Box>
  );
};
export default Questions;
