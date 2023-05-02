import { useState } from "react";
import styles from "./ConverseWithAI.module.css";
import Format from "./Format";
import { getContentFromChatGptAPI } from "../../API/SocialSharing";

export default function AIForm() {
  const [msgInput, setmsgInput] = useState("");
  const [result, setResult] = useState();
  const [sendBTN, setsendBTN] = useState("Send");

  async function onSubmit(event) {
    event.preventDefault();
    setsendBTN("...");
    if (msgInput !== "") {
      const data = await getContentFromChatGptAPI({ msg: msgInput });
      if (data.result)
        setResult(
          <Format oldResult={result} question={msgInput} answer={data.result} />
        );
      else alert("Something went wrong... Please try again !!!");

      setmsgInput("");
    }
    setsendBTN("Send");
  }

  return (
    <div>
      <title>CHATGPT - Steven</title>

      <main className={styles.main}>
        {/* <h3>Write your query...</h3> */}
        <div className={styles.result}>{result}</div>
        <br />
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="msg"
            placeholder=""
            value={msgInput}
            onChange={(e) => setmsgInput(e.target.value)}
          />
          <input type="submit" value={sendBTN} />
        </form>
      </main>
    </div>
  );
}
