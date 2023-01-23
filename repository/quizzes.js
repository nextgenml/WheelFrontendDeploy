const { runQueryAsync } = require("../utils/spinwheelUtil");

const deleteQuiz = async (level) => {
  const query = `update quizzes set is_active = 0 where level = ?;`;

  await runQueryAsync(query, [level]);

  const query2 = `select id from quizzes where level = ?;`;
  const quiz = await runQueryAsync(query2, [level]);
  const quiz_id = quiz[0]?.id;

  const query1 = `update quiz_questions set is_active = 0 where quiz_id = ?;`;

  await runQueryAsync(query1, [quiz_id]);
};

const createQuiz = async (data) => {
  const query = `insert into quizzes (level, starts_at, ends_at, show_answers_at, is_active) values(?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.level,
    data.starts_at,
    data.ends_at,
    data.show_answers_at,
    1,
  ]);
};
const createQuizQuestion = async (data) => {
  const query = `insert into quiz_questions (question, answer, quiz_id, is_active) values(?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.question,
    data.answer,
    data.quiz_id,
    1,
  ]);
};

const createQuizSubmission = async (data) => {
  const query = `insert into quiz_submissions (question_id, answer, is_correct) values(?, ?, ?);`;

  return await runQueryAsync(query, [
    data.question_id,
    data.answer,
    data.is_correct,
  ]);
};

module.exports = {
  createQuiz,
  createQuizQuestion,
  createQuizSubmission,
  deleteQuiz,
};
