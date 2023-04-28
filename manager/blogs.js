const promotionsRepo = require("../repository/promotions");
const blogsRepo = require("../repository/blogs");
const moment = require("moment");
const holderRepo = require("../repository/holder");
const { DATE_TIME_FORMAT, DATE_FORMAT } = require("../constants/momentHelper");
const { isUrlValid } = require("../utils");
const logger = require("../logger");

const getPromotedBlogs = async (walletId) => {
  const eligibleWallets = await promotionsRepo.eligibleWallets(walletId);
  return await blogsRepo.getPromotedBlogs(eligibleWallets, walletId);
};

const hasPostedValidBlogsPast = async (
  walletId,
  lastActionAt,
  includeToday
) => {
  const blogs = await blogsRepo.blogsOn(
    walletId,
    moment(lastActionAt).format(DATE_FORMAT)
  );

  const groups = groupBlogsByDate(blogs, includeToday);

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
      } else {
        validBlogs.push(blog);
      }
    }
    console.log(
      "validBlogs",
      validBlogs.length,
      moment(lastActionAt).format("YYYY-MM-DD")
    );
    if (validBlogs.length < process.env.MINIMUM_BLOGS_PER_DAY) return false;
  }
  return true;
};

const hasPostedValidBlogs = async (walletId, lastActionAt, includeToday) => {
  const blogs = await blogsRepo.blogsSince(
    walletId,
    moment(lastActionAt).startOf("day").format(DATE_TIME_FORMAT)
  );

  const groups = groupBlogsByDate(blogs, includeToday);

  const diffDays =
    moment().startOf("day").diff(moment(lastActionAt), "days") + 1;

  // console.log("diffDays", diffDays, Object.keys(groups).length);
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
      } else {
        validBlogs.push(blog);
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

const areLinksValid = async (walletId, links) => {
  const { facebookLink, mediumLink, linkedinLink, twitterLink } = links;

  if (!facebookLink || !mediumLink || !linkedinLink || !twitterLink)
    return {
      message: ["Some of the links are missing"],
      valid: false,
    };

  const account = await holderRepo.getById(walletId);

  if (
    !account ||
    !account.twitter_link ||
    !account.medium_link ||
    !account.linkedin_link ||
    !account.facebook_link
  )
    return {
      message: ["Account is missing"],
      valid: false,
    };

  const message = [];
  await isPostedLinkValid(account.medium_link, mediumLink, "Medium", message);
  await isPostedLinkValid(
    account.twitter_link,
    twitterLink,
    "Twitter",
    message
  );
  await isPostedLinkValid(
    account.linkedin_link,
    linkedinLink,
    "LinkedIn",
    message
  );
  // await isPostedLinkValid(
  //   account.facebook_link,
  //   facebookLink,
  //   "Facebook",
  //   message
  // );

  return {
    valid: message.filter((x) => !!x).length === 0,
    message,
  };
};
const isPostedLinkValid = async (handle, link, type, errors) => {
  if (handle && link) {
    if (
      !link.toLowerCase().includes(handle.toLowerCase()) &&
      !link.toLowerCase().includes(handle.toLowerCase().replace("@", ""))
    )
      errors.push(`${type} link is not from author profile.`);
    if (!(await isUrlValid(link))) errors.push(`Invalid ${type} link`);
    isValidDomain(type, link, errors);
  } else {
    errors.push(`${type} link or handle is missing`);
  }
};

const isValidDomain = (type, link, errors) => {
  switch (type) {
    case "Medium":
      if (!link.includes("medium.com"))
        errors.push("Link is not medium posted blog");
      break;
    case "Twitter":
      if (!link.includes("twitter.com"))
        errors.push("Link is not twitter posted blog");
      break;
    case "LinkedIn":
      if (!link.includes("linkedin.com"))
        errors.push("Link is not linkedIn posted blog");
      break;
    default:
      break;
  }
};
const validateAtHandles = (links) => {
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

  if (!isValidHandle(mediumLink))
    return { message: "Incorrect Medium Url", valid: false };
  if (!isValidHandle(twitterLink))
    return { message: "Incorrect Twitter Url", valid: false };
  if (!isValidHandle(linkedinLink))
    return { message: "Incorrect LinkedIn Url", valid: false };
  return { message: "", valid: true };
};
const isValidHandle = (link) => !link.includes("http") && !link.includes("/");

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
      console.log("blog updated", blog.id, message, valid);
    }
  } catch (error) {
    logger.error(`error in validateBlog: ${error}`);
  }
};
module.exports = {
  getPromotedBlogs,
  hasPostedValidBlogs,
  validateAtHandles,
  replaceTrailingSlash,
  referralMet,
  validateBlog,
  hasPostedValidBlogsPast,
};
