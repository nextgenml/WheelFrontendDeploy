/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import config from "../../config";
import { updateBlogCount } from "../../Utils/Blog";

const SaveInitiative = ({
  prompt,
  content,
  isPromote,
  promotedWallet,
  promotedId,
  getUserData,
  getBlogStats,
}) => {
  const { initiative } = useParams();
  const { address } = useAccount();
  const [isChecked, setIsChecked] = useState(false);
  const [isValidatedFlag, setIsValidatedFlag] = useState(null);
  const [isPaidFlag, setPaidFlag] = useState(null);
  const [result, setResult] = useState("");
  const [link, setLink] = useState("");
  const [isCopyDisable, setIsCopyDisable] = useState(true);
  const [isSubmit, setIsSubmit] = useState(true);

  const isCustom = initiative === "blog-customization";
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
      let res = await response.json();
      setResult(
        isCustom
          ? res.result
          : res.result +
              `\nJoin the revolution with NexGen ML\nWebsite: nexgenml.io\nTwitter: https://twitter.com/nextgen_ml\nTelgram: https://t.me/+JMGorMX41tM2NGIx`
      ).trim();
      setIsCopyDisable(false);
      if (isCustom) {
        await updateBlogCount(address);
        getBlogStats();
      }
    } else {
      notify("Something went wrong. Please try again later", "error");
    }
  }

  // link validation
  const isValidUrl = (urlString) => {
    let url;
    try {
      url = new URL(urlString);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  useEffect(() => {
    if (isChecked) {
      setResult("populating blog");
      const complete_prompt = isCustom
        ? `Write a ${Math.floor(
            Math.random() * (800 - 600 + 1) + 600
          )} word blog about ${prompt}`
        : `Write a ${Math.floor(
            Math.random() * (600 - 400 + 1) + 400
          )} word blog about ${prompt}. Blend in links within the blog  Website: nexgenml.io , Twitter: https://twitter.com/nextgen_ml , Telegram: https://t.me/+JMGorMX41tM2NGIx . Also advise how NexGen ML is playing a crucial role based on the prompt. Ignore title and do not repeat the question in the response.`;

      get_gpt_data(complete_prompt);
    }
  }, [isChecked]);

  // Check value empty
  useEffect(() => {
    if (isChecked && !isCopyDisable && link && isValidUrl(link)) {
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
    }
  }, [isCopyDisable, link]);

  async function onSubmitClick() {
    // send post request to save data in database
    if (
      ((isChecked && !isCopyDisable) || isPromote) &&
      (!link || isValidUrl(link))
    ) {
      const url = `${config.API_ENDPOINT}/save-blog-data`;
      let response = await fetch(url, {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: address,
          initiative,
          prompt,
          blog: isPromote ? content : result,
          link,
          validated_flag: isValidatedFlag ? true : null,
          paid_amount: config.PAID_AMOUNT,
          paid_flag: isPaidFlag ? true : null,
          promotedWallet,
          promotedId,
        }),
        method: "POST",
      });

      let res = await response.text();
      let data = JSON.parse(res);
      if (response.ok) {
        notify(data.msg, "success");
        if (isCustom && getUserData) getUserData();
      } else {
        notify(data.msg, "danger");
      }
    } else {
      notify("Please provide valid data", "danger");
    }
  }

  return (
    <div className="col-md-6 offset-md-3 col-lg-6 offset-lg-3">
      <form style={{ color: "white" }}>
        <div className="row g-3 m-3">
          <div className="col-sm-12">
            <span>{prompt}</span>
          </div>
          {!isPromote && (
            <div className="col-sm-12">
              <input
                className="form-check-input"
                type="checkbox"
                onClick={() => setIsChecked(!isChecked)}
              />
              <label>&nbsp;&nbsp;Generate Blog</label>
            </div>
          )}

          <div className="col-sm-12">
            <textarea
              className="form-control"
              placeholder="Blog Content"
              readOnly={true}
              value={isPromote ? content : result}
              style={{ height: "100px" }}
              disabled={isPromote}
            ></textarea>
          </div>
          {address === config.ADMIN_WALLET_1 && (
            <>
              <div className="col-sm-12">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={() => setIsValidatedFlag(!isValidatedFlag)}
                />
                <label>&nbsp;&nbsp;Validate Flag</label>
              </div>
              <div className="col-sm-12">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={() => setPaidFlag(!isPaidFlag)}
                />
                <label>&nbsp;&nbsp;Paid Flag</label>
              </div>
            </>
          )}
          <div className="col-sm-12">
            <button
              type="button"
              className="btn btn-success"
              disabled={!isPromote && isCopyDisable}
              onClick={() => {
                navigator.clipboard.writeText(result);
                notify("Copied", "info");
              }}
            >
              Copy
            </button>
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="link"
              placeholder="https://www.google.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <button
              type="button"
              disabled={!isPromote && !isCustom && isSubmit}
              className="btn btn-primary"
              onClick={onSubmitClick}
            >
              Submit
            </button>
          </div>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};
export default SaveInitiative;
