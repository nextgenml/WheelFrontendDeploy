import config from "../config.js";

export const fetchReferralsAPI = async (walletId, pageNo, pageSize) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/referrals/?walletId=${walletId}&pageNo=${pageNo}&pageSize=${pageSize}`
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

export const saveReferralAPI = async (walletId, payload) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/referrals?walletId=${walletId}`,
    {
      method: "POST",
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
