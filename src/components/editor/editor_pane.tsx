
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import levelStyles from "../levels/levels.module.css"
import { LANG } from "../lang/lang";
import { ReactNode } from "react";

export type Tab_Editor = {
    tab_kind: "editor"
}

export type Tab_ReactNode = {
    tab_kind: "react_node",
    node: ReactNode
}

export type Tab = Tab_Editor | Tab_ReactNode

interface EditorPaneProps {
    onMount: OnMount,
    onChange: OnChange,
    tabs: Tab[]
}

export default function EditorPane(props: EditorPaneProps) {



    return (<div className={styles.editorWrapper}>
        <div className={levelStyles.tabRow}>
            <button className={levelStyles.tabButton + " " + levelStyles.activeTabButton}> Tab 1</button>
        </div>
        <div style={{flexGrow: 1}}>
            <Editor
                options={{
                    minimap: {
                        autohide: true,
                        enabled: false
                    }
                }}
                className={styles.editor}
                onMount={props.onMount}
                onChange={props.onChange}
                defaultLanguage={LANG}
                height={"100%"}
                />
        </div>
    </div>)
}
