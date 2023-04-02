
import { useEffect, useState } from "react";
import styles from "./results.module.css";
import * as graphviz from "d3-graphviz";
import * as transition from "d3-transition";
import DebugBar from "./debug_bar";
import { GraphContext, GraphNodeID } from "../lang/graph";
import { Program, ProgramState, TestCase, compile } from "../lang/lang";
import { editor } from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";

export const ResultsDiv = "results-div";

export interface ResultsProps {
    mountedEditor: editor.IStandaloneCodeEditor | null,
    test_cases: TestCase[],
    loadedTestCase: number,
    setRunningSourceLine: (line: number) => void,
    serializer: (ctx: GraphContext, hovered_node_id: string | null) => string,
    onCompile?: () => void,
    onPlay?: () => void,
    onPause?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    const monacoConst = useMonaco();


    function onCompile(){
        if (!props.mountedEditor) throw "OnCompile called with no editor";
        if (!monacoConst) throw "OnCompile called without monaco";
        let program = compile(props.mountedEditor.getValue());
    
        run(program, () => {return {
            instruction_pointer: 0,
            graph_context: props.test_cases[props.loadedTestCase].initial_graph_provider()
        }}, (g) => setDisplayedGraph([g]));

    }


    const [hoveredNodeId, setHoveredNodeId] = useState<GraphNodeID | null>(null);
    const [displayedGraph, setDisplayedGraph] = useState<[GraphContext] | null>([props.test_cases[0].initial_graph_provider()]);
    const [instructionDelay, setInstructionDelay] = useState(1000);
    const [isRunPaused, setIsRunPaused] = useState(false);
    const [isRunStopped, setIsRunStopped] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [programState, setProgramState] = useState<ProgramState | null>(null);

    const step = (program: Program, state: ProgramState, update_graph_callback: (ctx: GraphContext) => void) => {
        let instruction = program[state.instruction_pointer];
        state.instruction_pointer++;
        instruction.evaluate(state);
        update_graph_callback(state.graph_context);
    }
    
    const run = async (program: Program, initial_state_provider: () => ProgramState, set_graph: (ctx: GraphContext) => void) => {
        console.log("Running program: ", program);

        let state = initial_state_provider();
        while (state.instruction_pointer < program.length) {
            props.setRunningSourceLine(program[state.instruction_pointer].source_line)
            if(!isRunPaused){
                step(program, state, set_graph);
            }

            if(isRunStopped) {
                setIsRunStopped(false);
                break;
            }
            await new Promise((resolve, reject) => setTimeout(resolve, instructionDelay));
        }
    }

    useEffect(() => {
        console.log("In useeffect - rerendering");
        
        if(displayedGraph){    
            console.log("Updating graph with", displayedGraph);
            let code = props.serializer(displayedGraph[0], hoveredNodeId);
            console.log("Rendering code", code);
            
            let gz = graphviz
                .graphviz("#" + ResultsDiv)
                .zoomScaleExtent([0, 0.5])
                .dot(code)
                .onerror(e => console.error(e))
                .transition(() => transition.transition("graphtransition").duration(250) as any)
                .render()

        }
    }, [displayedGraph, props.serializer, hoveredNodeId]);

    useEffect(() => {
        console.log("Setting hover listener");

        console.log("Adding");
        
        
        document.getElementById(ResultsDiv)?.addEventListener('mouseover', e => {
            let parent: HTMLElement | null = (e.target as HTMLElement).parentElement;
            
            if (parent) {
                if(parent.id.startsWith("graphnode_")) {
                    let hoveredid = parent.id.replace("graphnode_", "");
                    setHoveredNodeId(hoveredid);
                    console.log("Hovering nodeid", hoveredid);   
                }
            }

        })
    }, [])

    return (
        <div className={styles.resultsWrapper}>
            <DebugBar onCompile={onCompile} onPlay={props.onPlay} onPause={props.onPause}
                setExecutionDelay={props.setExecutionDelay} onStep={props.onStep} />
            <div id={ResultsDiv} className={styles.results_div} />
        </div>
    )
}
