
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import styles from "./editor.module.css";
import levelStyles from "../levels/levels.module.css"
import { LANG } from "../lang/lang";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Tab, Tab_ReactNode } from "../levels/level/Level";
import { editor, languages } from "monaco-editor";



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
    mountedEditor: editor.IStandaloneCodeEditor | null,
    onChange: OnChange,
    tabs: Tab[],
    runningSourceLine: number | null
}

export default function EditorPane(props: EditorPaneProps) {

    let [activeTab, setActiveTab] = useState(0);

    let lastDecorations = useRef<string[]>([]);
    useEffect(() => {
        if(props.mountedEditor){
            if(props.runningSourceLine !== null) {
                console.log("Bolding running sourceline " + props.runningSourceLine);
                lastDecorations.current = props.mountedEditor.deltaDecorations(lastDecorations.current, [
                    {
                        range: {
                            startLineNumber: props.runningSourceLine + 1,
                            endLineNumber: props.runningSourceLine + 1,
                            startColumn: 1,
                            endColumn: 1
                        },
                        options: {
                            isWholeLine: true,
                            inlineClassName: styles.activeLine,
                            marginClassName: styles.activeMargin,
                            className: styles.activeClass
                        }
                    }
                ])
            }
        }
    }, [props.mountedEditor, props.runningSourceLine]);


    return (<div className={styles.editorWrapper}>
        <div className={levelStyles.tabRow}>
            {props.tabs.map((e, ind) => {
                return <TabButton index={ind} tab_info={e} isActive={activeTab === ind} activate={() => setActiveTab(ind)}></TabButton>
            })}
        </div>
        <div style={{flexGrow: 1, overflowY: "scroll"}}>
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
