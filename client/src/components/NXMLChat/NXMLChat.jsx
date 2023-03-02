/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import config from "../../config";
import ReactPaginate from "react-paginate";
import Initiative from "./Initiative";

const BlogForm = () => {
  const { address } = useAccount();
  const [prompts, setPrompts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [WalletAdd, setWalletAdd] = useState();
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isSubmit, setIsSubmit] = useState(true);
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
      console.log(data);
      const split_data = data.result.split("\n");
      console.log(split_data);
      return split_data.filter((p) => p.match(/^\d/));
    }
  }

  async function get_gpt_data(input) {
    const url = "https://backend.chatbot.nexgenml.com/collections";
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
      let data = process_data(await response.json());
      // add footer
      setPrompts(data);
    } else {
      notify("Something went wrong. Please try again later", "error");
    }
  }

  async function get_user_data(offset) {
    const url = `${config.API_ENDPOINT}/get-blog-data?searchWalletAdd=${
      reset || WalletAdd === undefined ? "" : WalletAdd
    }&offset=${offset}`;
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

  async function updateFlagData(transactionID, vf, pf) {
    let data = {
      transactionID: transactionID,
      validatedFlag: vf,
      paidFlag: pf,
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
    // console.log(result);
    if (response.status === 200) {
      notify(result.msg, "success");
    } else {
      notify(result.msg, "danger");
    }
  }

  async function updateData(flagType, user, index) {
    if (flagType === "vf") {
      updateFlagData(user.transactionID, !user.validated_flag, user.paid_flag);
    } else {
      updateFlagData(user.transactionID, user.validated_flag, !user.paid_flag);
    }
    get_user_data(offset);
  }

  const handlePageClick = (event) => {
    setPageNo(event.selected);
    const newOffset = (event.selected * 10) % totalCount;
    setOffset(newOffset);
    get_user_data(newOffset);
  };

  let userRole = address;
  useEffect(() => {
    // Make the API call to the endpoint to get the prompts and update the state
    if (prompts.length === 0) {
      get_gpt_data(
        "List 10 ways in which social media will be improved by blockchain"
      );
    }
    console.log("LOOK HERE");
    console.log(address);
    console.log(userRole);
    if (userRole === config.ADMIN_WALLET_1) {
      get_user_data(offset);
    }
    // console.log(userData);
  }, []);

  useEffect(() => {
    if (WalletAdd) {
      setIsSubmit(false);
    }
  }, [WalletAdd]);

  function onSubmit() {
    get_user_data(offset);
  }

  function resetData() {
    reset = 1;
    get_user_data(offset);
  }

  return (
    <div>
      {prompts === undefined ? (
        <div className="d-flex justify-content-center">Loading...</div>
      ) : prompts.length === 0 ? (
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border"
            style={{
              width: "3rem",
              height: "3rem",
              color: "white",
              marginBottom: "16px",
            }}
            role="status"
          ></div>
        </div>
      ) : (
        prompts.map((prompt, index) => (
          <Initiative key={index} prompt={prompt} index={index} />
        ))
      )}

      {address === config.ADMIN_WALLET_1 && (
        <>
          <div className="p-2 col-md-12 col-lg-12">
            <h4 className="text-center">Blog Data</h4>
            <form>
              {/* <div class="row"> */}
              <div className="col-md-4 offset-md-4 col-lg-4 offset-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="search wallet"
                  value={WalletAdd}
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
            {userData === 0 ? (
              <div className="d-flex justify-content-center">
                {/* <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
      </div> */}
                <label className="text-center">No Data Found</label>
              </div>
            ) : (
              <div>
                <table className="table table-bordered bg-white">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">SR NO.</th>
                      <th scope="col">Wallet Address</th>
                      <th scope="col">Initiative</th>
                      <th scope="col">Promot</th>
                      <th scope="col">Blog</th>
                      <th scope="col">Link</th>
                      <th scope="col">Create Date</th>
                      <th scope="col">Validated Flag</th>
                      <th scope="col">Paid Amount</th>
                      <th scope="col">Paid Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.map((user, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{pageNo * pageSize + index + 1}</th>
                          <td>{user.wallet_address}</td>
                          <td>{user.initiative}</td>
                          <td>{user.prompt}</td>
                          <td>{user.blog}</td>
                          <td>{user.link}</td>
                          <td>{user.create_date}</td>
                          <td className="text-center">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={user.validated_flag}
                                onChange={() => updateData("vf", user, index)}
                              />
                            </div>
                          </td>
                          <td>{user.paid_amount}</td>
                          <td className="text-center">
                            {/* <label onClick={() => updateData("pf", user, index)}>{user.paid_flag ? "TRUE" : "FALSE"}</label> */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={user.paid_flag}
                                onChange={() => updateData("pf", user, index)}
                              />
                            </div>
                          </td>
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
    </div>
  );
};

export default BlogForm;
