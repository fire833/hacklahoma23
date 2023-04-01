
import { useEffect, useState } from "react";
import styles from "./results.module.css";
import * as graphviz from "d3-graphviz";
import * as transition from "d3-transition";
import DebugBar from "./debug_bar";
import { GraphContext, GraphNodeID } from "../lang/graph";

export const ResultsDiv = "results-div";

export interface ResultsProps {
    graph: GraphContext | null,
    serializer: (ctx: GraphContext, hovered_node_id: string | null) => string,
    onCompile?: () => void,
    onPlay?: () => void,
    onPause?: () => void,
    setExecutionDelay?: (delay: number) => void,
    onStep?: () => void,
}

// Primary pane for viewing results.
export default function ResultsPane(props: ResultsProps) {

    const [hoveredNodeId, setHoveredNodeId] = useState<GraphNodeID | null>(null);

    useEffect(() => {
        console.log("In useeffect");
        
        if(props.graph){    
            console.log("Updating graph with", props.graph);
            let code = props.serializer(props.graph, hoveredNodeId);
            graphviz
                .graphviz("#" + ResultsDiv)
                .dot(code)
                .onerror(e => console.error(e))
                .transition(() => transition.transition().duration(250) as any)
                .render();
        }
    });

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
                    
                } else {
                }
            }

        })
    }, [])

    return (
        <div>
            <DebugBar onCompile={props.onCompile} onPlay={props.onPlay} onPause={props.onPause}
                setExecutionDelay={props.setExecutionDelay} onStep={props.onStep} />
            <div id={ResultsDiv} className={styles.results_div} />
        </div>
    )
}
