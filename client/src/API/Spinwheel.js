import config from "../config.js";
import { customFetch } from "./index.js";

export const fetchNextEligibleUsersAPI = async () => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/spinWheel/next-users`
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
