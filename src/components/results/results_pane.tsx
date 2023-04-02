
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
    completedTestCases: number[],
    loadedTestCase: number,
    setRunningSourceLine: (line: number) => void,
    serializer: (ctx: GraphContext, hovered_node_id: string | null) => string,
    onCompile?: () => void,
    onPlay?: () => void,
    onPause?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
    completeTestCase: (num: number) => void
}


interface RunHooks {
    step: () => void,
    pause: () => void,
    play: () => void,
    stop: () => void,
    setInstructionDelay: (num: number) => void
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    const monacoConst = useMonaco();

    const onCompile = () => {
        if(!isProgramActive || playPauseButtonState === "setPlaying"){
            let run_hooks = init_run();
            run_hooks.play();
        }
    }

    const [hoveredNodeId, setHoveredNodeId] = useState<GraphNodeID | null>(null);
    const [displayedGraph, setDisplayedGraph] = useState<[GraphContext] | null>([props.test_cases[props.loadedTestCase].initial_graph_provider()]);
    const [instructionDelay, setInstructionDelay] = useState(500);
    const [runHooks, setRunHooks] = useState<null | RunHooks>(null);
    const [completed, setCompleted] = useState(false);
    const [isProgramActive, setIsProgramActive] = useState(false);
    const [playPauseButtonState, setPlayPauseButtonState] = useState<"setPlaying" | "setPausing">("setPausing");

    useEffect(() => {
        if(!isProgramActive || playPauseButtonState === "setPlaying") {
            let ctx = props.test_cases[props.loadedTestCase].initial_graph_provider();
            setDisplayedGraph([ctx]);
        }

        if(props.completedTestCases.indexOf(props.loadedTestCase) === -1){
            setCompleted(false);
        }
    }, [props.loadedTestCase])

    const init_run = () => {
        if (!props.mountedEditor) throw "OnCompile called with no editor";
        if (!monacoConst) throw "OnCompile called without monaco";
        let program = compile(props.mountedEditor.getValue());
        let state_provider = () => {return {
            instruction_pointer: 0,
            program: program,
            graph_context: props.test_cases[props.loadedTestCase].initial_graph_provider()
        }};

        let graph_callback = (g: GraphContext) => {setDisplayedGraph([g])};

        let state = state_provider();

        let instruction_delay = instructionDelay;
        
        const step = () => {
            let instruction = program[state.instruction_pointer];
            props.setRunningSourceLine(program[state.instruction_pointer].source_line)
            state.instruction_pointer++;
            instruction.evaluate(state);
            graph_callback(state.graph_context);
        }

        let timeoutHandle: number = -1;
        const loop = () => {
            if(state.instruction_pointer < program.length){
                step();
                timeoutHandle = setTimeout(() => {
                    loop();
                }, instruction_delay);
            } else {
                let predicate_evals = props.test_cases[props.loadedTestCase].solution_predicates.map(e => e(state.graph_context));
                if (predicate_evals.every(e => e)) {
                    setCompleted(true);
                    props.completeTestCase(props.loadedTestCase);
                }
                setIsProgramActive(false);
            }
        }

        let runHooks: RunHooks = {
            play: () => {
                setPlayPauseButtonState("setPausing")
                loop();
            },
            pause: () => {
                setPlayPauseButtonState("setPlaying");
                clearTimeout(timeoutHandle);
            },
            step: () => {
                step()
            },
            stop: () => {
                clearTimeout(timeoutHandle);
                setIsProgramActive(false);
            },
            setInstructionDelay: (delay: number) => {
                instruction_delay = delay;
            }
        }

        setRunHooks(runHooks);
        setIsProgramActive(true);

        return runHooks;
    
    }

    useEffect(() => {
        console.log("In useeffect - rerendering");
        
        if(displayedGraph){    
            console.log("Updating graph with", displayedGraph);
            let code = props.serializer(displayedGraph[0], hoveredNodeId);
            console.log("Rendering code", code);
            
            let gz = graphviz
                .graphviz("#" + ResultsDiv)
                .zoomScaleExtent([0, 0.9])
                .dot(code)
                .onerror(e => console.error(e))
                .transition(() => transition.transition("graphtransition").duration(instructionDelay) as any)
                .render()

        }
    }, [displayedGraph, props.serializer, hoveredNodeId, props.loadedTestCase]);

    useEffect(() => {    
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
            <DebugBar isProgramActive={isProgramActive} playPauseButtonState={playPauseButtonState} onCompile={onCompile} onPlay={runHooks?.play} onPause={runHooks?.pause}
                setExecutionDelay={(delay) => {
                    setInstructionDelay(delay)
                    runHooks?.setInstructionDelay(delay);
                }} onStep={runHooks?.step} onStop={runHooks?.stop} />
            <div id={ResultsDiv} className={styles.results_div + " " + (completed ? styles.correct : "")} />
        </div>
    )
}
