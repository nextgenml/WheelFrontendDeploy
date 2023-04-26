import config from "../config.js";
import { customFetch } from "./index.js";

export const saveSocialLinksAPI = async (walletId, payload) => {
  const res = await customFetch(
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
export const fetchHolderNonceAPI = async (walletId) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/holders/nonce?walletId=${walletId}`
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

export const loginHolderAPI = async (payload) => {
  const res = await customFetch(`${config.API_ENDPOINT}/api/v1/holders/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    // alert("Login successful");
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};
