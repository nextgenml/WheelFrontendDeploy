const logger = require("../logger");
const paymentsRepo = require("../repository/payments");

const getPayments = async (req, res) => {
  try {
    const { walletId, pageNo, pageSize, date } = req.query;

    const [data, total_count] = await paymentsRepo.getPayments(
      walletId,
      date,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );

    return res.status(200).json({
      payments: data,
      totalCount: total_count,
    });
  } catch (error) {
    logger.error(`error occurred in get getPayments api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};
module.exports = {
  getPayments,
};
