import config from "../config.js";
import { getAPICall, writeAPICall } from "./index.js";

export const fetchReferralsAPI = async (walletId, pageNo, pageSize) => {
  return getAPICall(
    `${config.API_ENDPOINT}/api/v1/referrals/?walletId=${walletId}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
};

export const saveReferralAPI = async (walletId, payload) => {
  return writeAPICall(
    `${config.API_ENDPOINT}/api/v1/referrals?walletId=${walletId}`,
    payload
  );
};

export const updateReferralAPI = async (walletId, id, payload) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/referrals/${id}?walletId=${walletId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    alert("Saved successfully");
    return true;
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};

export const topReferralsAPI = async (walletId) => {
  return getAPICall(
    `${config.API_ENDPOINT}/api/v1/referrals/top?walletId=${walletId}`
  );
};
