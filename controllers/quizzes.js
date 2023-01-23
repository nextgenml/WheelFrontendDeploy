const {
  deleteQuiz,
  createQuiz,
  createQuizQuestion,
} = require("../repository/quizzes");
const { readContentsFromCsv } = require("../utils/csv");

const uploadQuiz = async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || !files[0])
      return res.status(400).json({
        statusCode: 400,
        message: "CSV file is missing",
      });

    const csvFile = files[0];

    const contents = await readContentsFromCsv(csvFile.path);

    for (const row of contents) {
      await deleteQuiz(row.level);

      const { insertId } = await createQuiz({
        level: row.level,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
        show_answers_at: row.show_answers_at,
      });

      const questions = row.questions.split("||");
      const answers = row.answers.split("||");
      const index = 0;
      for (const question of questions) {
        await createQuizQuestion({
          question,
          answer: answers[index],
          quiz_id: insertId,
        });
        index += 1;
      }
    }

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

module.exports = {
  uploadQuiz,
};
