import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const Initiative = ({ prompt, index }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isvalidatedFlag, setIsvalidatedFlag] = useState(null);
  const [ispaidFlag, setpaidFlag] = useState(null);
  const [result, setResult] = useState("");
  const [link, setLink] = useState("");
  const [iscopyDisable, setiscopyDisable] = useState(true);
  const [isSubmit, setisSubmit] = useState(true);

  // Toast alert
  const notify = (msg, toastType) => {
    if (toastType == "success") {
      toast.success(msg)
    } else if (toastType == "info") {
      toast.info(msg);
    } else {
      toast.error(msg);
    }
  };

  async function get_gpt_data(input) {
    const url = "https://backend.chatbot.nexgenml.com/collections"
    let response = await fetch(url, {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: JSON.stringify({ msg: input }),
      method: "POST"
    });
    let res = await response.json()
    setResult(res.result)
    setiscopyDisable(false)
  }

  // link validation
  const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  useEffect(() => {
    if (isChecked) {
      setResult("populating blog");
      get_gpt_data(`Write a blog post about ${prompt}`)
    }
  }, [isChecked]);

  // Check value empty
  useEffect(() => {
    if (isChecked && !iscopyDisable && link && isValidUrl(link)) {
      setisSubmit(false);
    } else {
      setisSubmit(true);
    }
  }, [iscopyDisable, link]);


  async function onSubmitClick() {
    // send post request to save data in database
    if (isChecked && !iscopyDisable && link && isValidUrl(link)) {
      const url = "http://localhost:8000/save-data"
      let response = await fetch(url, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: 1,
          initiative: 'social media',
          prompt,
          blog: result,
          link,
          validated_flag: isvalidatedFlag ? true : null,
          paid_amount: 10,
          paid_flag: ispaidFlag ? true : null
        }),
        method: "POST"
      });

      let res = await response.text();
      let data = JSON.parse(res);
      if (response.status == "200") {
        notify(data.msg, "success")
      } else {
        notify(data.msg, "danger")
      }
    } else {
      notify("Please provide valid data", "danger")
    }
  }

  return (
    <div className="col-md-6 offset-md-3 col-lg-6 offset-lg-3">
      <form>
        <div className="row g-3 m-3">
          <div className="col-sm-12">
            <span>{prompt}</span>
          </div>
          <div className="col-sm-12">
            <input className="form-check-input" type="checkbox" onClick={() => setIsChecked(!isChecked)} />
          </div>
          <div className="col-sm-12">
            <textarea className="form-control" placeholder="Blog Content" readOnly={true} value={result} style={{ height: "100px" }} ></textarea>
          </div>
          <div className="col-sm-12">
            <input className="form-check-input" type="checkbox" onClick={() => setIsvalidatedFlag(!isvalidatedFlag)} />
          </div>
          <div className="col-sm-12">
            <input className="form-check-input" type="checkbox" onClick={() => setpaidFlag(!ispaidFlag)} />
          </div>
          <div className="col-sm-12">
            <button type="button" className="btn btn-success" disabled={iscopyDisable} onClick={() => { navigator.clipboard.writeText(result); notify("Copied", "info") }}>Copy</button>
          </div>
          <div className="col-sm-12">
            <input type="url" className="form-control" id="link" placeholder="https://www.google.com" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <div className="col-sm-12">
            <button type="button" disabled={isSubmit} className="btn btn-primary"
              onClick={onSubmitClick}
            >Submit</button>
          </div>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

const BlogForm = () => {
  const [prompts, setPrompts] = useState([]);
  const routeParams = useParams();
  console.log(routeParams);
  const initiative = routeParams.initiative.replace('-', ' ');
  function process_data(data) {
    if (data.result) {
      console.log(data)
      const split_data = data.result.split('\n');
      console.log(split_data)
      return split_data.filter(p => p.match(/^\d/))
    }
  }

  async function get_gpt_data(input) {
    const url = "https://backend.chatbot.nexgenml.com/collections"
    let response = await fetch(url, {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: JSON.stringify({ msg: input }),
      method: "POST"
    });
    setPrompts(process_data(await response.json()))
  }

  useEffect(() => {
    // Make the API call to the endpoint to get the prompts and update the state
    if (prompts.length === 0) {
      get_gpt_data(`List 10 ways in which ${initiative} will be improved by blockchain`)
    }
  }, []);

  return (
    <div>
      {prompts.length === 0 ? <div className="d-flex justify-content-center"><div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
      </div></div> : prompts.map((prompt, index) => (
        <Initiative key={index} prompt={prompt} index={index} />
      ))}
    </div>
  );
};

export default BlogForm;
