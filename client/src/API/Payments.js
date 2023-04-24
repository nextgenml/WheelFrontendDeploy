import config from "../config.js";
import { customFetch } from "./index.js";

export const fetchPaymentsAPI = async (walletId, query) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/payments?` +
      new URLSearchParams({
        walletId,
        ...query,
      })
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return {};
  }
};

export const fetchPaymentStatsAPI = async (walletId) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/payments/stats?walletId=${walletId}`
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return {};
  }
};
