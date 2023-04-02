import { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { ReactNode, useState } from "react";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { LevelHeader } from "../LevelHeader";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { TestCase, compile } from "../../lang/lang";
import levelStyles from "../levels.module.css";

export type Tab_Editor = {
    tab_kind: "editor",
    tab_name: "Editor"
}

export type Tab_ReactNode = {
    tab_kind: "react_node",
    tab_name: string,
    node: ReactNode
}

export type Tab = Tab_Editor | Tab_ReactNode

export interface LevelProps {
    tabs: Tab[],
    test_cases: TestCase[]
}
export function Level(props: LevelProps) {
    const monacoConst = useMonaco();

    const [mountedEditor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

    const [graphSerializer, setGraphSerializer] = useState<SerializerKey>("bfs");

    const [loadedTestCase, setLoadedTestCase] = useState(0);

    const [runningSourceLine, setRunningSourceLine] = useState<number | null>(null);

    return <div className={levelStyles.levelWrapper}>
        <LevelHeader></LevelHeader>
        <span></span>
        <main className={levelStyles.levelPanes}>
            <EditorPane
                onMount={(e) => setEditor(e)}
                mountedEditor={mountedEditor}
                onChange={(e) => { }}
                tabs={props.tabs}
                runningSourceLine={runningSourceLine}
            ></EditorPane>
            <span style={{width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 255, 0.2)"}}></span>
            <ResultsPane setRunningSourceLine={setRunningSourceLine} mountedEditor={mountedEditor} serializer={GraphContext.serializers[graphSerializer]} test_cases={props.test_cases} loadedTestCase={loadedTestCase} />
        </main>
    </div>
}