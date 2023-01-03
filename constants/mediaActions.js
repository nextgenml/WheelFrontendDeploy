const getMediaActions = (mediaType) => {
  switch (mediaType) {
    case "twitter":
      // return ["retweet"];
      return ["like", "retweet", "comment"];
  }
};

module.exports = {
  getMediaActions,
};
