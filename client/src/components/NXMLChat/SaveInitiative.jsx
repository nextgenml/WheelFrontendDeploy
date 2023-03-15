/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalImage from "react-modal-image";
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
  const [mediumlink, setmediumLink] = useState("");
  const [twitterlink, settwitterLink] = useState("");
  const [hashword, sethashWord] = useState("");
  const [keyWord, setkeyWord] = useState("");
  const [facebooklink, setfacebookLink] = useState("");
  const [linkedinlink, setlinkedinLink] = useState("");
  const [instagramlink, setinstagramLink] = useState("");
  const [pinterestlink, setpinterestLink] = useState("");
  const [isCopyDisable, setIsCopyDisable] = useState(true);
  const [isSubmit, setIsSubmit] = useState(true);
  const [customblogImages, setcustomblogImages] = useState([]);
  const [blogImagesFiles, setblogImagesFiles] = useState([]);
  let blogImageskey;

  let blogImages = {
    economicdevelopment: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    education: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    energy: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    environmentprotection: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    foodproduction: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    socialwelfare: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    healthcare: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    security: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    socialmedia: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
    spaceexploration: ["food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png", "food.png"],
  };

  if (initiative == "economic-development") {
    blogImageskey = "economicdevelopment";
  } else if (initiative == "environment-protection") {
    blogImageskey = "environmentprotection";
  } else if (initiative == "food-production") {
    blogImageskey = "foodproduction";
  } else if (initiative == "social-media") {
    blogImageskey = "socialmedia";
  } else if (initiative == "social-welfare") {
    blogImageskey = "socialwelfare";
  } else {
    blogImageskey = "";
  }

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

  const onFileUpload = async (e) => {
    console.log(e.target.files[0]);
    setblogImagesFiles(e.target.files);
    let flag = 1;
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (!(e.target.files[i].type.includes("image"))) {
        flag = 0;
        notify("Please select valid file!", "error");
      }
      if ((Math.round((e.target.files[i].size / 1024)) > 500)) {
        flag = 0;
        notify("Size is too big!", "error");
      }
      if (flag > 0) {
        console.log(i);
        images.push(URL.createObjectURL(e.target.files[i]));
      }
      flag = 1;
    }
    setcustomblogImages(images);
  };

  const ImageCopy = async (imgUrl) => {
    console.log("imgUrl", imgUrl);
    const blob = await fetch(imgUrl).then((resp) => resp.blob());
    navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob
      })
    ]);
  }
  
  async function get_gpt_data(input, callFor) {
    console.log("get gpt data", input);
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
      let resData = res.result;
      let indexOfone;
      if (callFor == "hashwords") {
        console.log(resData.includes("1. "));
        if (resData.includes("1. ")) {
          indexOfone = resData.indexOf("1. ");
        } else {
          indexOfone = resData.indexOf("#");
        }
        sethashWord(resData.substr(indexOfone));
      } else if (callFor == "keywords") {
        if (resData.includes("1. ")) {
          indexOfone = resData.substr(resData.indexOf("1. "));
        } else {
          indexOfone = resData;
        }
        setkeyWord(indexOfone);
      } else {
        setResult(
          (isCustom
            ? res.result
            : res.result +
            `\nJoin the revolution with NexGen ML\nWebsite: nexgenml.io\nTwitter: https://twitter.com/nextgen_ml\nTelgram: https://t.me/+JMGorMX41tM2NGIx`
          ).trim()
        );
        setIsCopyDisable(false);
        if (isCustom) {
          await updateBlogCount(address);
          getBlogStats();
        }
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
    if (result && result != "populating blog") {
      console.log("ready for hash word");
      get_gpt_data("provide 10 trending twitter # hashword for 'Improved Transparency: Blockchain technology can create an open, transparent, and secure digital ledger that can be used to store data related to social welfare programs such as benefits, healthcare, and other forms of assistance.'", 'hashwords');
    }
  }, [result])

  useEffect(() => {
    if (hashword) {
      console.log("ready for hash word");
      get_gpt_data("provide 10 trending keywords for 'Improved Transparency: Blockchain technology can create an open, transparent, and secure digital ledger that can be used to store data related to social welfare programs such as benefits, healthcare, and other forms of assistance.'", 'keywords');
    }
  }, [hashword])

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
    if (isChecked && !isCopyDisable &&
      mediumlink && isValidUrl(mediumlink) &&
      twitterlink && isValidUrl(twitterlink) &&
      facebooklink && isValidUrl(facebooklink) &&
      linkedinlink && isValidUrl(linkedinlink) &&
      instagramlink && isValidUrl(instagramlink) &&
      pinterestlink && isValidUrl(pinterestlink)
    ) {
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
    }
  }, [isCopyDisable, link, mediumlink, twitterlink, facebooklink, linkedinlink, instagramlink, pinterestlink]);

  async function onSubmitClick() {
    // send post request to save data in database
    const finalContent = isPromote ? content : result;
    if (finalContent && finalContent.length > 60000) {
      notify(
        `Blog cannot be more than 60000 characters, please remove extra ${finalContent.length - 60000
        } characters`
      );
      return;
    }
    if (
      ((isChecked && !isCopyDisable) || isPromote) &&
      (!mediumlink || isValidUrl(mediumlink)) &&
      (!twitterlink || isValidUrl(twitterlink)) &&
      (!facebooklink || isValidUrl(facebooklink)) &&
      (!linkedinlink || isValidUrl(linkedinlink)) &&
      (!instagramlink || isValidUrl(instagramlink)) &&
      (!pinterestlink || isValidUrl(pinterestlink))
    ) {

      const formData = new FormData();
      formData.append('wallet_address', address);
      formData.append('initiative', initiative);
      formData.append('prompt', prompt);
      formData.append('blog', finalContent);
      formData.append('mediumurl', mediumlink);
      formData.append('twitterurl', twitterlink);
      formData.append('facebookurl', facebooklink);
      formData.append('linkedinurl', linkedinlink);
      formData.append('instagramurl', instagramlink);
      formData.append('pinteresturl', pinterestlink);
      formData.append('hashword', hashword);
      formData.append('keyword', keyWord);
      formData.append('validated_flag', isValidatedFlag ? true : null);
      formData.append('paid_amount', config.PAID_AMOUNT);
      formData.append('paid_flag', isPaidFlag ? true : null);
      formData.append('promotedWallet', promotedWallet);
      formData.append('promotedId', promotedId);
      console.log(blogImagesFiles);

      if (blogImagesFiles && blogImagesFiles.length > 0) {
        Array.from(blogImagesFiles).forEach((file, i) => {
          formData.append(`file-${i}`, file, file.name);
        });
      }
      const url = `${config.API_ENDPOINT}/save-blog-data`;
      let response = await fetch(url, {
        method: "POST",
        body: formData,
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
              readOnly={isPromote}
              onChange={(e) => setResult(e.target.value)}
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
              id="mediumLink"
              placeholder="https://www.medium.com"
              value={mediumlink}
              onChange={(e) => setmediumLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="twitterLink"
              placeholder="https://www.twitter.com"
              value={twitterlink}
              onChange={(e) => settwitterLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="facebooklink"
              placeholder="https://www.facebook.com"
              value={facebooklink}
              onChange={(e) => setfacebookLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="linkedinlink"
              placeholder="https://www.linkedin.com"
              value={linkedinlink}
              onChange={(e) => setlinkedinLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="instagramlink"
              placeholder="https://www.instagran.com"
              value={instagramlink}
              onChange={(e) => setinstagramLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <input
              type="url"
              className="form-control"
              id="pinterestlink"
              placeholder="https://www.pinterest.com"
              value={pinterestlink}
              onChange={(e) => setpinterestLink(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            <textarea
              type="text"
              className="form-control"
              id="hashword"
              placeholder="#nextgenml"
              value={hashword}
              readOnly
              style={{ height: "100px" }}
            ></textarea>
          </div>
          <div className="col-sm-12">
            <textarea
              type="text"
              className="form-control"
              id="keyword"
              placeholder="trending keywords"
              value={keyWord}
              readOnly
              style={{ height: "100px" }}
            ></textarea>
          </div>
          <div className="col-sm-12">
            <div className="row">
              {initiative != "blog-customization" &&
                blogImages[initiative.includes("-") ? blogImageskey : initiative].map((item, i) => (
                  <div className="col m-2" key={i}>
                    <ModalImage
                      small={`/images/blogImages/${initiative}/${item}`}
                      large={`/${item}`}
                      alt={item}
                    />
                    <button
                      key={i}
                      id={i}
                      onClick={() => { ImageCopy(`/${item}`) }}
                      type="button"
                      className="btn btn-success mt-2 text-center">Copy</button>
                  </div>
                ))
              }
            </div>
          </div>
          {initiative == "blog-customization" &&
            <div className="col-sm-12">
              <input className="form-control form-control-lg" id={`customImage`} multiple type="file" accept="image/*" onChange={onFileUpload} />
            </div>
          }
          <div className="col-sm-12">
            <div className="row">
              {customblogImages &&
                customblogImages.map((item, i) => (
                  <div className="col m-2" key={i}>
                    <ModalImage
                      // small={`/images/blogImages/${initiative}/${item}`}
                      small={`${item}`}
                      large={`${item}`}
                      alt={item}
                    />
                  </div>
                ))
              }
            </div>
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
