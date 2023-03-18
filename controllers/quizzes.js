const logger = require("../logger");
const fs = require("fs");
const quizRepo = require("../repository/quizzes");
const { readContentsFromCsv } = require("../utils/csv");
const config = require("../config/env");
const { intersectionOfArrays } = require("../utils");
const moment = require("moment");

const uploadQuiz = async (req, res) => {
  try {
    const { files } = req;

    if (!files || !files[0])
      return res.status(400).json({
        statusCode: 400,
        message: "CSV file is missing",
      });

    const csvFile = files[0];

    const contents = await readContentsFromCsv(csvFile.path);

    for (const row of contents) {
      const deletedQuizId = await quizRepo.deleteQuiz(row.quiz_level);

      const { insertId } = await quizRepo.createQuiz({
        level: row.quiz_level,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
        show_answers_at: row.show_answers_at,
        reward: row.reward,
      });

      const questions = row.questions.split("||");
      const answers = row.answers.split("||");
      let index = 0;
      for (const question of questions) {
        await quizRepo.createQuizQuestion({
          question,
          answer: answers[index],
          quiz_id: insertId,
        });
        index += 1;
      }

      // console.log("deletedQuizId", deletedQuizId);
      const deletedQuizSubmissions = await quizRepo.getDeletedQuizSubmissions(
        deletedQuizId
      );

      for (const sub of deletedQuizSubmissions) {
        index = 0;
        for (const question of questions) {
          if (sub.question.toLowerCase() === question.toLowerCase()) {
            // console.log("question", question, "sub", sub);
            await quizRepo.updateSubmission(
              sub.id,
              sub.user_answer.toLowerCase() === answers[index].toLowerCase()
            );
          }
          index += 1;
        }
      }
    }
    fs.unlink(csvFile.path, () => {});
    res.json({
      message: "Uploaded successfully",
    });
  } catch (error) {
    logger.error(`error occurred in uploadQuiz api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const getQuestionsByLevel = async (req, res) => {
  try {
    const { level, wallet_id } = req.query;
    if (!wallet_id)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet id is missing",
      });

    const data = await quizRepo.getQuestionsByLevel(level, wallet_id);

    let intersection, is_admin;
    if (wallet_id === config.ADMIN_WALLET) {
      is_admin = true;
      const walletsGroup = [];
      for (const question of data) {
        const wallets = await quizRepo.correctAnsweredWallets(question.id);
        question.correct_answered_wallets = wallets;
        walletsGroup.push(wallets);
      }
      intersection = intersectionOfArrays(walletsGroup);
    }

    for (const question of data) {
      if (!is_admin && moment(question.show_answers_at).diff(moment()) > 0) {
        question.is_correct = undefined;
        question.show_result = false;
      } else question.show_result = true;

      if (!is_admin) question.answer = undefined;
    }

    res.json({
      data,
      is_admin,
      correct_answered_quiz_wallets: intersection,
    });
  } catch (error) {
    logger.error(`error occurred in getQuestionsByLevel api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const saveAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const { wallet_id } = req.query;

    if (!wallet_id || !answers)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet id or answers are missing",
      });

    for (const answer of answers) {
      await quizRepo.createQuizSubmission(answer, wallet_id);
    }
    res.json({
      message: "Quiz answers saved!",
    });
  } catch (error) {
    logger.error(`error occurred in saveAnswers api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const { wallet_id } = req.query;

    if (!wallet_id)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet is missing",
      });

    const { quizzes, completedQuizzes } = await quizRepo.getAllQuizzes(
      wallet_id
    );

    let totalReward = 0;
    const completedIds = completedQuizzes.map((x) => x.quiz_id);

    for (const quiz of quizzes)
      if (
        !completedIds.includes(quiz.id) &&
        moment(quiz.starts_at).diff(moment()) < 0
      )
        totalReward += quiz.reward;

    res.json({
      quizzes,
      total_reward: totalReward,
    });
  } catch (error) {
    logger.error(`error occurred in getAllQuizzes api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};
module.exports = {
  uploadQuiz,
  getQuestionsByLevel,
  saveAnswers,
  getAllQuizzes,
};
