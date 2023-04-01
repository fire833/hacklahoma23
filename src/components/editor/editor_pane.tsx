
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import levelStyles from "../levels/levels.module.css"
import { LANG } from "../lang/lang";
import { ReactNode, useState } from "react";
import { Tab, Tab_ReactNode } from "../levels/level/Level";



interface TabButtonProps {
    index: number,
    tab_info: Tab,
    isActive: boolean,
    activate: () => void
}

function TabButton(props: TabButtonProps) {
    return <button onClick={props.activate} className={levelStyles.tabButton + " " + (props.isActive ? levelStyles.activeTabButton : "")}> {props.tab_info.tab_name} </button>; 
}

interface EditorPaneProps {
    onMount: OnMount,
    onChange: OnChange,
    tabs: Tab[]
}

export default function EditorPane(props: EditorPaneProps) {

    let [activeTab, setActiveTab] = useState(0);

    return (<div className={styles.editorWrapper}>
        <div className={levelStyles.tabRow}>
            {props.tabs.map((e, ind) => {
                return <TabButton index={ind} tab_info={e} isActive={activeTab === ind} activate={() => setActiveTab(ind)}></TabButton>
            })}
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
                height={props.tabs[activeTab].tab_kind === "editor" ? "100%" : "0px"}
                width={props.tabs[activeTab].tab_kind === "editor" ? "100%" : "0px"}
                />

            {props.tabs[activeTab].tab_kind === "react_node" && (props.tabs[activeTab] as Tab_ReactNode).node}
        </div>
    </div>)
}
