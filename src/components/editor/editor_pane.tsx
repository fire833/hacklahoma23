
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import { LANG } from "../lang/lang";

interface EditorPaneProps {
    onMount: OnMount,
    onChange: OnChange
}

export default function EditorPane(props: EditorPaneProps) {
    return (<div className={styles.editorWrapper}>
        <Editor
            onMount={props.onMount}
            onChange={props.onChange}
            defaultLanguage={LANG}
        />
    </div>)
}
