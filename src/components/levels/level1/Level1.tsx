import { useState } from "react";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { editor } from "monaco-editor";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { useMonaco } from "@monaco-editor/react";
import { compile, run } from "../../lang/lang";
import levelStyles from "../levels.module.css";
import { LevelHeader } from "../LevelHeader";

export type Level1Props = {
    active_level: number
}

const LEVEL_NUM = 1;

export function Level1(props: Level1Props) {


    const monacoConst = useMonaco();

    const [mountedEditor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

    const [displayedGraph, setDisplayedGraph] = useState<GraphContext | null>(null);
    const [graphSerializer, setGraphSerializer] = useState<SerializerKey>("bfs");

    if (props.active_level !== 1) return <></>;

    return <div className={levelStyles.levelWrapper}>
        <LevelHeader></LevelHeader>
        <span></span>
        <main className={levelStyles.levelPanes}>
            <EditorPane
                onMount={(e) => setEditor(e)}
                onChange={(e) => { }}
                tabs={[{
                    tab_kind: "editor"
                }]}
            ></EditorPane>
            <ResultsPane graph={displayedGraph} serializer={GraphContext.serializers[graphSerializer]} onCompile={() => {
                if (!mountedEditor) throw "OnCompile called with no editor";
                if (!monacoConst) throw "OnCompile called without monaco";
                let program = compile(mountedEditor.getValue());

                run(program, {
                    instruction_pointer: 0,
                    graph_context: new GraphContext({
                        "a": new GraphNode("a", 0, ["b", "c"]),
                        "b": new GraphNode("b", 1, ["a"]),
                        "c": new GraphNode("c", 5, ["a"])
                    }, "a")
                }, setDisplayedGraph);

            }} />
        </main>
    </div>
}