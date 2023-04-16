const { DATE_FORMAT } = require("../constants/momentHelper");
const { blogsDoneOn, updatePayment, createPayment } = require("../repository/payments");
const moment = require('moment');
const { hasPostedValidBlogsPast } = require("./blogs");

const validatePayment = async (date, walletId) => {
    const todayBlog = await blogsDoneOn(
        walletId,
        moment(date).format(DATE_FORMAT)
        );

    if (!todayBlog || todayBlog.amount <= 0) {
    const validated = await hasPostedValidBlogsPast(
        walletId,
        date,
        true
    );

    if (todayBlog && validated)
        await updatePayment(todayBlog.id, process.env.DAY_BLOG_PRIZE);
    else if (!todayBlog)
        await createPayment(walletId, {
        type: "blog",
        is_paid: 0,
        amount: validated ? process.env.DAY_BLOG_PRIZE : 0,
        earned_at: date,
        });
    console.log("updated for ", walletId);
    }
}
module.exports = {validatePayment}