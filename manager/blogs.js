const promotionsRepo = require("../repository/promotions");
const blogsRepo = require("../repository/blogs");
const moment = require("moment");
const holderRepo = require("../repository/holder");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { isUrlValid } = require("../utils");
const logger = require("../logger");

const getPromotedBlogs = async (walletId) => {
  const eligibleWallets = await promotionsRepo.eligibleWallets(walletId);
  return await blogsRepo.getPromotedBlogs(eligibleWallets, walletId);
};

const hasPostedValidBlogs = async (walletId, lastActionAt, includeToday) => {
  const blogs = await blogsRepo.blogsSince(
    walletId,
    moment(lastActionAt).startOf("day").format(DATE_TIME_FORMAT)
  );

  const groups = groupBlogsByDate(blogs, includeToday);

  const diffDays =
    moment().startOf("day").diff(moment(lastActionAt), "days") + 1;

  console.log("diffDays", diffDays, Object.keys(groups).length);
  if (diffDays > Object.keys(groups).length) return false;

  for (const date of Object.keys(groups)) {
    const postedBlogs = groups[date];

    if (postedBlogs.length < process.env.MINIMUM_BLOGS_PER_DAY) return false;

    const validBlogs = [];
    for (const blog of postedBlogs) {
      if (!blog.validated_flag) {
        const res = await areLinksValid(walletId, {
          facebookLink: blog.facebookurl,
          mediumLink: blog.mediumurl,
          linkedinLink: blog.linkedinurl,
          twitterLink: blog.twitterurl,
        });
        if (res.valid) validBlogs.push(blog);
      }
    }
    if (validBlogs.length < process.env.MINIMUM_BLOGS_PER_DAY) return false;
  }
  return true;
};

const groupBlogsByDate = (blogs, includeToday) => {
  const groups = blogs.reduce((groups, blog) => {
    if (
      includeToday ||
      moment().startOf("day").diff(moment(blog.create_date)) > 1
    ) {
      const date = moment(blog.create_date).format().split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(blog);
    }
    return groups;
  }, {});
  return groups;
};

const referralMet = async (twitter, referredAt) => {
  const holder = await holderRepo.getByTwitter(twitter);
  if (!holder)
    return {
      met: false,
      twitter: 0,
      message: "No holder",
    };
  const walletId = holder.wallet_id;
  const blogs = await blogsRepo.blogsSince(
    walletId,
    moment(referredAt).startOf("day").format(DATE_TIME_FORMAT)
  );

  const groups = groupBlogsByDate(blogs, true);

  for (const date of Object.keys(groups)) {
    const postedBlogs = groups[date];

    const validBlogs = [];
    for (const blog of postedBlogs) {
      if (blog.validated_flag) validBlogs.push(blog);
      else {
        const res = await areLinksValid(walletId, {
          facebookLink: blog.facebookurl,
          mediumLink: blog.mediumurl,
          linkedinLink: blog.linkedinurl,
          twitterLink: blog.twitterurl,
        });
        if (res.valid) validBlogs.push(blog);
      }
    }
    if (validBlogs.length >= process.env.MINIMUM_BLOGS_PER_DAY)
      return {
        met: true,
        twitter: process.env.MINIMUM_BLOGS_PER_DAY,
      };
  }
  return {
    met: false,
    twitter: 0,
  };
};

const getAtHandle = (link) => {
  const split = link.split("/");
  return split[split.length - 1].trim();
};

const areLinksValid = async (walletId, links) => {
  const { facebookLink, mediumLink, linkedinLink, twitterLink } = links;

  if (!facebookLink || !mediumLink || !linkedinLink || !twitterLink)
    return {
      message: ["Some of the links are missing"],
      valid: false,
    };

  const account = await holderRepo.getById(walletId);

  if (!account)
    return {
      message: ["Account is missing"],
      valid: false,
    };

  const message = [];
  if (account.medium_link) {
    const validLink = await isUrlValid(mediumLink);
    console.log(
      "getAtHandle",
      getAtHandle(account.medium_link),
      mediumLink,
      validLink,
      mediumLink.includes(getAtHandle(account.medium_link))
    );
    if (!mediumLink.includes(getAtHandle(account.medium_link)) || !validLink)
      message.push("Invalid Medium Link");
  }

  if (account.twitter_link) {
    if (
      !twitterLink.includes(getAtHandle(account.twitter_link)) ||
      !(await isUrlValid(twitterLink))
    )
      message.push("Invalid Twitter Link");
  }

  if (account.linkedin_link) {
    const link = account.linkedin_link.replace("/in/", "/posts/");
    if (
      !linkedinLink.includes(getAtHandle(link)) ||
      !(await isUrlValid(linkedinLink))
    )
      message.push("Invalid LinkedIn Link");
  }
  if (account.facebook_link) {
    if (
      !facebookLink.includes(getAtHandle(account.facebook_link)) ||
      !(await isUrlValid(facebookLink))
    )
      message.push("Invalid Facebook Link");
  }
  return {
    valid: message.length === 0,
    message,
  };
};

const validDomains = (links) => {
  const { facebookLink, mediumLink, linkedinLink, twitterLink, telegramLink } =
    links;

  if (
    !facebookLink ||
    !mediumLink ||
    !linkedinLink ||
    !twitterLink ||
    !telegramLink
  )
    return { message: "All Links are required", valid: false };

  if (!facebookLink.includes("facebook.com"))
    return { message: "Incorrect Facebook Url", valid: false };
  if (!mediumLink.includes("medium.com"))
    return { message: "Incorrect Medium Url", valid: false };
  if (!twitterLink.includes("twitter.com"))
    return { message: "Incorrect Twitter Url", valid: false };
  if (!linkedinLink.includes("linkedin.com"))
    return { message: "Incorrect LinkedIn Url", valid: false };
  if (!linkedinLink.includes("linkedin.com"))
    return { message: "Incorrect LinkedIn Url", valid: false };

  return { message: "", valid: true };
};
const replaceTrailingSlash = (value) => {
  if (value[value.length - 1] === "/") return value.slice(0, value.length - 1);
  return value;
};

const validateBlog = async (blogId) => {
  try {
    const blog = await blogsRepo.getBlogById(blogId);
    if (!blog.validated_flag) {
      const { valid, message } = await areLinksValid(blog.wallet_address, {
        facebookLink: blog.facebookurl,
        mediumLink: blog.mediumurl,
        linkedinLink: blog.linkedinurl,
        twitterLink: blog.twitterurl,
      });

      await blogsRepo.validateBlog(blogId, valid, message.join(", "));
      console.log("blog updated", blog.id);
    }
  } catch (error) {
    logger.error(`error in validateBlog: ${error}`);
  }
};
module.exports = {
  getPromotedBlogs,
  hasPostedValidBlogs,
  validDomains,
  replaceTrailingSlash,
  referralMet,
  validateBlog,
};
