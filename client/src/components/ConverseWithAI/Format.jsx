export default function Format(props) {
  return (
    <>
      <div>
        <h5 style={{ margin: 0, padding: 0 }}>{props.question}</h5>
        <p style={{ whiteSpace: "pre-line" }}>{props.answer}</p>
        <hr />
      </div>
      {props.oldResult}
    </>
  );
}
