import config from "../config.js";

export const updateBlogCount = async (walletId) => {
  return await fetch(`${config.API_ENDPOINT}/update-blog-count`, {
    method: "POST",
    body: JSON.stringify({
      walletId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
