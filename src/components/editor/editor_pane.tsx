
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import { LANG } from "../lang/lang";

interface EditorPaneProps {
    onMount: OnMount,
    onChange: OnChange
}

export default function EditorPane(props: EditorPaneProps) {
    return (<div className={styles.editorWrapper}>
        <div className={styles.tabRow}>
            <button> Tab 1</button>
        </div>
        <div style={{flexGrow: 1}}>
            <Editor
                onMount={props.onMount}
                onChange={props.onChange}
                defaultLanguage={LANG}
                height={"100%"}
                />
        </div>
    </div>)
}
