
import Editor, { OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";

interface EditorPaneProps {
    onMount: OnMount
}

export default function EditorPane(props: EditorPaneProps) {
    return (<div className={styles.editorWrapper}>
        <Editor
            onMount={props.onMount}
        />
    </div>)
}
