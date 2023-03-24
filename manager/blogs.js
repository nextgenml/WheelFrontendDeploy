const promotionsRepo = require("../repository/promotions");
const blogsRepo = require("../repository/blogs");
const moment = require("moment");
const holderRepo = require("../repository/holder");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const getPromotedBlogs = async (walletId) => {
  const eligibleWallets = await promotionsRepo.eligibleWallets(walletId);
  return await blogsRepo.getPromotedBlogs(eligibleWallets, walletId);
};

const isEligibleForNextSpin = async (walletId, lastActionAt) => {
  const blogs = await blogsRepo.blogsSince(
    walletId,
    moment(lastActionAt).startOf("day").format(DATE_TIME_FORMAT)
  );

  const groups = blogs.reduce((groups, blog) => {
    if (moment().startOf("day").diff(moment(blog.create_date)) > 1) {
      const date = moment(blog.create_date).format().split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(blog);
    }
    return groups;
  }, {});

  const diffDays =
    moment().startOf("day").diff(moment(lastActionAt), "days") + 1;

  if (diffDays > Object.keys(groups).length) return false;
  for (const date of Object.keys(groups)) {
    const postedBlogs = groups[date];

    if (postedBlogs.length < process.env.MINIMUM_BLOGS_PER_DAY) return false;

    const validBlogs = [];
    for (const blog of postedBlogs) {
      const res = await areLinksValid(walletId, {
        facebookLink: blog.facebookurl,
        mediumLink: blog.mediumurl,
        linkedinLink: blog.linkedinurl,
        twitterLink: blog.twitterurl,
      });
      if (res.valid) validBlogs.push(blog);
    }
    if (validBlogs.length < process.env.MINIMUM_BLOGS_PER_DAY) return false;
  }
  return true;
};

const areLinksValid = async (walletId, links) => {
  const { facebookLink, mediumLink, linkedinLink, twitterLink } = links;

  if (!facebookLink || !mediumLink || !linkedinLink || !twitterLink)
    return {
      message: "Some of the links are missing",
      valid: false,
    };

  const account = await holderRepo.getById(walletId);

  if (account.medium_link) {
    if (!mediumLink.startsWith(account.medium_link))
      return {
        message: "Invalid Medium Link",
        valid: false,
      };
  }

  if (account.twitter_link) {
    if (!twitterLink.startsWith(account.twitter_link))
      return {
        message: "Invalid Twitter Link",
        valid: false,
      };
  }

  if (account.linkedin_link) {
    const link = account.linkedin_link.replace("/in/", "/posts/");
    if (!linkedinLink.startsWith(link))
      return {
        message: "Invalid LinkedIn Link",
        valid: false,
      };
  }
  if (account.facebook_link) {
  }
  return {
    valid: true,
    message: "",
  };
};

const validDomains = (links) => {
  const { facebookLink, mediumLink, linkedinLink, twitterLink } = links;

  if (!facebookLink || !mediumLink || !linkedinLink || !twitterLink)
    return { message: "All Links are required", valid: false };

  if (!facebookLink.includes("facebook.com"))
    return { message: "Incorrect Facebook Url", valid: false };
  if (!mediumLink.includes("medium.com"))
    return { message: "Incorrect Medium Url", valid: false };
  if (!twitterLink.includes("twitter.com"))
    return { message: "Incorrect Twitter Url", valid: false };
  if (!linkedinLink.includes("linkedin.com"))
    return { message: "Incorrect LinkedIn Url", valid: false };

  return { message: "", valid: true };
};
const replaceTrailingSlash = (value) => {
  if (value[value.length - 1] === "/") return value.slice(0, value.length - 1);
  return value;
};

module.exports = {
  getPromotedBlogs,
  isEligibleForNextSpin,
  validDomains,
  replaceTrailingSlash,
};
