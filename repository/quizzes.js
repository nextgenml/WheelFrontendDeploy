const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const config = require("../config");

const getAllQuizzes = async (walletId) => {
  const query = `select level, reward, starts_at from quizzes where is_active = 1 order by level asc;`;
  const quizzes = await runQueryAsync(query, []);

  const query2 = `select distinct qq.quiz_id from quiz_questions qq inner join quiz_submissions qs on qs.question_id = qq.id where wallet_id = ?`;
  const completedQuizzes = await runQueryAsync(query2, [walletId]);

  return {
    quizzes,
    completedQuizzes,
  };
};
const getDeletedQuizSubmissions = async (quizId) => {
  const query = `select qs.question_id, qs.id, qs.answer as user_answer, qq.question from quiz_submissions qs 
                  inner join quiz_questions qq on qq.id = qs.question_id 
                  where qq.quiz_id = ?;`;
  return await runQueryAsync(query, [quizId]);
};

const updateSubmission = async (id, isCorrect) => {
  const query = `update quiz_submissions set is_correct = ? where id = ?`;
  return await runQueryAsync(query, [isCorrect, id]);
};
const deleteQuiz = async (level) => {
  const query = `update quizzes set is_active = 0 where level = ?;`;

  await runQueryAsync(query, [level]);

  const query2 = `select id from quizzes where level = ?;`;
  const quiz = await runQueryAsync(query2, [level]);
  const quiz_id = quiz[0]?.id;

  const query1 = `update quiz_questions set is_active = 0 where quiz_id = ?;`;

  await runQueryAsync(query1, [quiz_id]);

  return quiz_id;
};

const createQuiz = async (data) => {
  const query = `insert into quizzes (level, starts_at, ends_at, show_answers_at, is_active, reward) values(?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.level,
    data.starts_at,
    data.ends_at,
    data.show_answers_at,
    1,
    data.reward,
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

const createQuizSubmission = async (answer, wallet_id) => {
  const query1 = `select answer as correctAnswer from quiz_questions where id = ?;`;
  const questions = await runQueryAsync(query1, [answer.id]);
  const { correctAnswer } = questions[0];

  const query = `insert into quiz_submissions (question_id, answer, is_correct, wallet_id) values(?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    answer.id,
    answer.user_input,
    correctAnswer.toString().toLowerCase() ==
    answer.user_input.toString().toLowerCase()
      ? 1
      : 0,
    wallet_id,
  ]);
};

const getQuestionsByLevel = async (level, wallet_id) => {
  const query = `select qs.question_id as id, qs.answer as user_answer, qs.is_correct, qq.question, qq.answer, q.show_answers_at from quiz_submissions qs 
                inner join quiz_questions qq on qq.id = qs.question_id 
                inner join quizzes q on q.id = qq.quiz_id 
                where level = ? and wallet_id = ?;`;
  const submissions = await runQueryAsync(query, [level, wallet_id]);

  if (submissions && submissions.length) {
    return submissions;
  }

  const query1 = `select qq.question, qq.id from quiz_questions qq
                inner join quizzes q on q.id = qq.quiz_id 
                where level = ? and qq.is_active = 1 and q.is_active = 1 and (q.starts_at <= ? and q.ends_at >= ? or 1 != ?);`;

  const currentTime = moment().format();
  return await runQueryAsync(query1, [
    level,
    currentTime,
    currentTime,
    config.ADMIN_WALLET === wallet_id ? 0 : 1,
  ]);
};

const correctAnsweredWallets = async (level, wallet_id) => {
  const query = `select distinct wallet_id from quiz_submissions where question_id = ? and is_correct = 1;`;
  const submissions = await runQueryAsync(query, [level, wallet_id]);

  return submissions.map((s) => s.wallet_id);
};
module.exports = {
  createQuiz,
  createQuizQuestion,
  createQuizSubmission,
  deleteQuiz,
  getQuestionsByLevel,
  correctAnsweredWallets,
  getDeletedQuizSubmissions,
  updateSubmission,
  getAllQuizzes,
};
