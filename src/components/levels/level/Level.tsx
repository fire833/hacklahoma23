import { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { ReactNode, useState } from "react";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { LevelHeader } from "../LevelHeader";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { TestCase, compile, run } from "../../lang/lang";
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

    const [displayedGraph, setDisplayedGraph] = useState<GraphContext | null>(props.test_cases[0].initial_graph_provider());
    const [graphSerializer, setGraphSerializer] = useState<SerializerKey>("bfs");

    const [loadedTestCase, setLoadedTestCase] = useState(0);

    return <div className={levelStyles.levelWrapper}>
        <LevelHeader></LevelHeader>
        <span></span>
        <main className={levelStyles.levelPanes}>
            <EditorPane
                onMount={(e) => setEditor(e)}
                onChange={(e) => { }}
                tabs={props.tabs}
            ></EditorPane>
            <span style={{ width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 255, 0.2)" }}></span>
            <ResultsPane graph={displayedGraph} serializer={GraphContext.serializers[graphSerializer]} onCompile={() => {
                if (!mountedEditor) throw "OnCompile called with no editor";
                if (!monacoConst) throw "OnCompile called without monaco";
                let program = compile(mountedEditor.getValue());

                run(program, () => {return {
                    instruction_pointer: 0,
                    graph_context: props.test_cases[loadedTestCase].initial_graph_provider()
                }}, (g) => setDisplayedGraph(g));

            }} />
        </main>
    </div>
}