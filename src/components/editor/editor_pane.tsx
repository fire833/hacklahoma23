
import Editor, { OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import { LANG } from "../lang/lang";

interface EditorPaneProps {
    onMount: OnMount
}

export default function EditorPane(props: EditorPaneProps) {
    return (<div className={styles.editorWrapper}>
        <Editor
            onMount={props.onMount}
            defaultLanguage={LANG}
        />
    </div>)
}
