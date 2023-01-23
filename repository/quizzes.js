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

const getQuestionsByLevel = async (level) => {
  const query = `select qs.answer as user_answer, qs.is_correct, qq.question, qq.answer, q.show_answers_at from quiz_submissions qs 
                inner join quiz_questions qq on qq.id = qs.question_id 
                inner join quizzes q on q.id = qq.quiz_id 
                where level = ?;`;
  const submissions = await runQueryAsync(query, [level]);

  if (submissions && submissions.length) {
    return submissions;
  }

  const query1 = `select qq.question, qq.id from quiz_questions qq
                inner join quizzes q on q.id = qq.quiz_id 
                where level = ? and qq.is_active = 1 and q.is_active = 1;`;

  return await runQueryAsync(query1, [level]);
};
module.exports = {
  createQuiz,
  createQuizQuestion,
  createQuizSubmission,
  deleteQuiz,
  getQuestionsByLevel,
};
