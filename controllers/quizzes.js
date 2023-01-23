const logger = require("../logger");
const fs = require("fs");
const quizRepo = require("../repository/quizzes");
const { readContentsFromCsv } = require("../utils/csv");

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
      await quizRepo.deleteQuiz(row.quiz_level);

      const { insertId } = await quizRepo.createQuiz({
        level: row.quiz_level,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
        show_answers_at: row.show_answers_at,
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
    }
    fs.unlink(csvFile.path, () => {});
    res.json({
      message: "Uploaded successfully",
    });
  } catch (ex) {
    logger.error(`error occurred in uploadQuiz api: ${ex}`);
    res.status(400).json({
      statusCode: 400,
      message: ex,
    });
  }
};

const getQuestionsByLevel = async (req, res) => {
  try {
    const { level } = req.query;

    const data = await quizRepo.getQuestionsByLevel(level);
    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error occurred in getQuestionsByLevel api: ${ex}`);
    res.status(400).json({
      statusCode: 400,
      message: ex,
    });
  }
};

const saveAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    for (const answer of answers) {
      await quizRepo.createQuizSubmission(answer);
    }
    res.json({
      message: "Quiz answers saved!",
    });
  } catch (error) {
    logger.error(`error occurred in saveAnswers api: ${ex}`);
    res.status(400).json({
      statusCode: 400,
      message: ex,
    });
  }
};
module.exports = {
  uploadQuiz,
  getQuestionsByLevel,
  saveAnswers,
};
