import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import styles from "./RichTextEditor.module.css";
import { useState } from "react";
import draftToHtml from "draftjs-to-html";

const RichTextEditor = ({ onChange, initialHtml }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(initialHtml))
    )
  );

  const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  return (
    <Editor
      editorState={editorState}
      toolbarClassName={styles.toolbarMain}
      wrapperClassName="wrapperClassName"
      editorClassName={styles.editorMain}
      onEditorStateChange={(state) => {
        setEditorState(state);
        onChange(content);
      }}
      readOnly
    />
  );
};
export default RichTextEditor;
