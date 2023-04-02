import { useEffect, useState } from "react"
import { GraphContext, GraphNodeID } from "../lang/graph"
import { graphviz } from "d3-graphviz";
import { transition } from "d3-transition";
import styles from "./StaticGraph.module.css";

interface StaticGraphProps {
    uid: string,
    ctx: GraphContext,
    width?: string,
    serializer: (graph: GraphContext, hoveredNodeId: GraphNodeID | null) => string
}

export function StaticGraph(props: StaticGraphProps) {

    const [hoveredNodeId, setHoveredNodeId] = useState<GraphNodeID | null>(null);

    
    useEffect(() => {
        let code = props.serializer(props.ctx, hoveredNodeId);
        console.log("Rendering code", code);
        
        let gz = graphviz("#" + props.uid)
            .zoomScaleExtent([0, 0.75])
            .dot(code)
            .onerror(e => console.error(e))
            .transition(() => transition("graphtransition").duration(250) as any)
            .render()
    }, [props.ctx, props.serializer, hoveredNodeId]);

    
    useEffect(() => {    
        document.getElementById(props.uid)?.addEventListener('mouseover', e => {
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

    return <div style={{
        width: props.width
    }} id={props.uid} className={styles.wrapper_div}></div>
}