const getMediaActions = (mediaType) => {
  switch (mediaType) {
    case "twitter":
      return ["like", "retweet", "comment"];
  }
};

module.exports = {
  getMediaActions,
};
