/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import config from "../../config";
import ReactPaginate from "react-paginate";
import Initiative from "./SaveInitiative";
import { useParams, useSearchParams } from "react-router-dom";
import { Box, Typography, Link, Button } from "@mui/material";
import BlogStats from "./BlogStats";
import ShowBlog from "./ShowBlog";
import { updateBlogCount } from "../../Utils/Blog";

const BlogForm = () => {
  const { address, isConnected } = useAccount();
  const [prompts, setPrompts] = useState();
  const [userData, setUserData] = useState([]);
  const [walletAdd, setWalletAdd] = useState();
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isSubmit, setIsSubmit] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, _] = useSearchParams();
  const { initiative } = useParams();
  const [promotedBlogs, setPromotedBlogs] = useState([]);
  const [openStatsId, setOpenStatsId] = useState(0);
  const [showBlog, setShowBlog] = useState(null);
  const [blogStats, setBlogStats] = useState({});
  const [showGenerate, setGenerate] = useState(false);
  let reset = 0;

  // Toast alert
  const notify = (msg, toastType) => {
    if (toastType === "success") {
      toast.success(msg);
    } else if (toastType === "info") {
      toast.info(msg);
    } else {
      toast.error(msg);
    }
  };

  function process_data(data) {
    if (data.result) {
      const split_data = data.result.split("\n");
      return split_data.filter((p) => p.match(/^\d/));
    }
  }

  async function get_gpt_data(input, raw) {
    const url = `https://backend.chatbot.nexgenml.com/collections?raw=${raw}`;
    let response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: JSON.stringify({ msg: input }),
      method: "POST",
    });
    if (response.ok) {
      if (isCustom) {
        await updateBlogCount(address);
        getBlogStats();
      }
      let data = process_data(await response.json());
      setPrompts(data);
    } else {
      notify("Something went wrong. Please try again later", "error");
    }
  }

  async function get_user_data(offset) {
    const url =
      initiative === "blog-customization"
        ? `${config.API_ENDPOINT}/get-custom-blogs?pageNo=${pageNo}&pageSize=${pageSize}&walletId=${address}`
        : `${config.API_ENDPOINT}/get-blog-data?searchWalletAdd=${
            reset || !walletAdd ? "" : walletAdd
          }&offset=${offset}&walletId=${address}`;
    let response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      setUserData(result?.data ? result.data : 0);
      setTotalCount(result?.totalResult ? result.totalResult : 0);
      setPageCount(
        (result.totalResult ? result.totalResult : 0) < pageSize
          ? 1
          : Math.ceil(result.totalResult / pageSize)
      );
    } else {
      notify("Something went wrong. Please try again later", "error");
    }
  }

  async function updateFlagData(transactionID, vf, pf, promoted) {
    let data = {
      transactionID: transactionID,
      validatedFlag: vf,
      paidFlag: pf,
      promoted,
      walletId: address,
    };
    const url = `${config.API_ENDPOINT}/update-blog-data`;
    let response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "PUT",
    });

    let result = await response.json();
    if (response.ok) {
      notify(result.msg, "success");
    } else {
      notify(result.msg, "danger");
    }
  }

  async function updateData(user, paid, validated, promoted) {
    await updateFlagData(user.transactionID, paid, validated, promoted);
    get_user_data(offset);
  }

  const handlePageClick = (event) => {
    setPageNo(event.selected);
    const newOffset = (event.selected * 10) % totalCount;
    setOffset(newOffset);
    get_user_data(newOffset);
  };

  let userRole = address;
  const isAdmin = userRole === config.ADMIN_WALLET_1;
  const isCustom = initiative === "blog-customization";
  const isPromote = initiative === "promote-blogs";
  const getBlogStats = async () => {
    if (isCustom) {
      const res1 = await fetch(
        `${config.API_ENDPOINT}/blog-stats?walletId=${address}`
      );
      const data = await res1.json();
      setBlogStats(data);
    }
  };
  const getPromotionBlogs = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/promoted-blogs/?walletId=${address}`
    );
    if (res.ok) {
      const { data } = await res.json();
      setPromotedBlogs(data);
    } else {
      notify("Something went wrong. Please try later", "danger");
    }
  };
  useEffect(() => {
    getBlogStats();
    if (isPromote) {
      getPromotionBlogs();
      return;
    }
    if (isAdmin || isCustom) get_user_data(offset);

    const view = searchParams.get("view") === "1";
    if (view) {
      setPrompts([]);
      return;
    }

    const queryPrompts = (searchParams.get("prompts") || "")
      .split("||")
      .filter((x) => !!x);
    if (Array.isArray(queryPrompts) && queryPrompts.length)
      setPrompts(queryPrompts.filter((x) => !!x));
    else
      get_gpt_data(
        searchParams.get("context") ||
          `List 10 ways in which ${initiative} will be improved by blockchain`,
        !!searchParams.get("context")
      );
  }, []);

  useEffect(() => {
    if (walletAdd) {
      setIsSubmit(false);
    }
  }, [walletAdd]);

  function onSubmit() {
    get_user_data(offset);
  }

  function resetData() {
    reset = 1;
    get_user_data(offset);
  }

  const renderPrompts = () => {
    if (isPromote)
      return promotedBlogs.map((blog, index) => (
        <Initiative
          key={index}
          prompt={blog.prompt}
          content={blog.blog}
          isPromote
          promotedWallet={blog.wallet_address}
          promotedId={blog.id}
        />
      ));
    else {
      if (
        !isPromote &&
        !isCustom &&
        localStorage.getItem(`${initiative}_blog_cache` && !showGenerate)
      ) {
        <Button variant="contained" onClick={() => setGenerate(true)}>
          Generate Prompts
        </Button>;
      } else
        return prompts.map((prompt, index) => (
          <Initiative
            key={index}
            prompt={prompt}
            index={index}
            isCustom={isCustom}
            getUserData={get_user_data}
            getBlogStats={getBlogStats}
          />
        ));
    }
  };
  const finalPrompts = isPromote ? promotedBlogs : prompts;
  if (!isConnected)
    return (
      <Typography variant="h6" sx={{ mb: 20 }}>
        Please connect your wallet
      </Typography>
    );
  if (!finalPrompts || !Array.isArray(finalPrompts))
    return (
      <div className="d-flex justify-content-center">
        <div
          className="spinner-border"
          style={{
            width: "3rem",
            height: "3rem",

            marginBottom: "16px",
          }}
          role="status"
        ></div>
      </div>
    );
  return (
    <Box sx={{ p: 3 }}>
      {finalPrompts.length > 0 ? (
        renderPrompts()
      ) : (
        <Typography variant="h6" sx={{ mb: 20 }}>
          No blogs to display
        </Typography>
      )}

      {(isCustom || isAdmin) && (
        <>
          <div className="p-2 col-md-12 col-lg-12">
            <h4 className="text-center">Blog Data</h4>
            {isCustom && (
              <Typography
                variant="body2"
                className="text-center"
                sx={{ mb: 2 }}
              >
                Paid Plan for promotions - {blogStats.totalCountP}
                <br />
                Completed Promotions - {blogStats.usedCountP}
                <br />
                Paid Plan for blogs - {blogStats.totalCountB}
                <br />
                Completed blogs - {blogStats.usedCountB}
                <br />
              </Typography>
            )}

            {isAdmin && (
              <form>
                <div className="col-md-4 offset-md-4 col-lg-4 offset-lg-4">
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder="search wallet"
                    value={walletAdd}
                    onChange={(e) => setWalletAdd(e.target.value)}
                  />
                </div>
                <div className="col-md-4 offset-md-4 col-lg-4 offset-lg-4 mb-2 mt-2">
                  <button
                    type="button"
                    disabled={isSubmit}
                    style={{ marginRight: 5 }}
                    className="btn btn-primary"
                    onClick={onSubmit}
                  >
                    Submit
                  </button>
                  <input
                    type="reset"
                    className="btn btn-primary"
                    disabled={isSubmit}
                    onClick={() => {
                      setWalletAdd("");
                      resetData();
                    }}
                    value="Reset"
                  />
                </div>
              </form>
            )}
            {userData === 0 ? (
              <div className="d-flex justify-content-center">
                <label className="text-center">No Data Found</label>
              </div>
            ) : (
              <div>
                <table className="table table-bordered bg-white">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">SR NO.</th>
                      {!isCustom && (
                        <>
                          <th scope="col">Wallet Address</th>
                          <th scope="col">Initiative</th>
                        </>
                      )}

                      <th scope="col">Promot</th>
                      <th scope="col">Blog</th>
                      {isCustom && <th scope="col">View Stats</th>}
                      <th scope="col">Link</th>
                      <th scope="col">Create Date</th>

                      {!isCustom && <th scope="col">Paid Amount</th>}
                      {isCustom && <th scope="col">Promote blog</th>}
                      {isAdmin && (
                        <>
                          <th scope="col">Validated Flag</th>
                          <th scope="col">Paid Flag</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.map((user, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{pageNo * pageSize + index + 1}</th>
                          {!isCustom && (
                            <>
                              <td>{user.wallet_address}</td>
                              <td>{user.initiative}</td>
                            </>
                          )}

                          <td>{user.prompt}</td>
                          <td>
                            {user.blog.slice(0, 10)}....
                            <Link onClick={() => setShowBlog(user)}>
                              View Blog
                            </Link>
                          </td>
                          {isCustom && (
                            <td>
                              <Link onClick={() => setOpenStatsId(user.id)}>
                                View Stats
                              </Link>
                            </td>
                          )}
                          <td>{user.link}</td>
                          <td>{user.create_date}</td>
                          {!isCustom && <td>{user.paid_amount}</td>}
                          {isCustom && (
                            <td className="text-center">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={user.promoted}
                                  onChange={(e) =>
                                    updateData(
                                      user,
                                      user.paid_flag,
                                      user.validated_flag,
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                          )}
                          {isAdmin && (
                            <>
                              <td className="text-center">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`validated_flag${index}`}
                                    key={index}
                                    checked={user.validated_flag}
                                    onChange={(e) =>
                                      updateData(
                                        user,
                                        user.paid_flag,
                                        e.target.checked,
                                        user.promoted
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`paid_flag${index}`}
                                    key={index}
                                    checked={user.paid_flag}
                                    onChange={(e) =>
                                      updateData(
                                        user,
                                        e.target.checked,
                                        user.validated_flag,
                                        user.promoted
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <ReactPaginate
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={pageCount}
                  previousLabel="< previous"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
              </div>
            )}
          </div>
          <ToastContainer />
        </>
      )}

      {openStatsId > 0 && (
        <BlogStats
          blogId={openStatsId}
          onClose={() => setOpenStatsId(0)}
          address={address}
        />
      )}
      {showBlog && (
        <ShowBlog
          currentRow={showBlog}
          onClose={() => {
            setShowBlog(null);
            get_user_data(offset);
          }}
        />
      )}
    </Box>
  );
};

export default BlogForm;
