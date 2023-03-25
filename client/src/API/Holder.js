import config from "../config.js";

export const fetchSocialLinksAPI = async (walletId) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/holders/social-links?walletId=${walletId}`
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

export const saveSocialLinksAPI = async (walletId, payload) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/holders/social-links?walletId=${walletId}`,
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
