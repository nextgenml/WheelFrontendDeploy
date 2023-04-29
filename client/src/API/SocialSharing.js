import config from "../config.js";
import { customFetch } from "./index.js";

export const getContentFromChatGptAPI = async (payload) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/contentProducer`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};

export const markChoreAsDoneAPI = async (walletId, choreId, payload) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/socialSharing/chores/${choreId}/done?walletId=${walletId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};

export const validateChoreAPI = async (walletId, choreId, action, payload) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/socialSharing/chores/${choreId}/validate/${action}?walletId=${walletId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};
