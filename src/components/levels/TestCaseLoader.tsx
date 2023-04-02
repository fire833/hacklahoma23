import { GraphContext } from "../lang/graph"
import { TestCase } from "../lang/lang"
import { StaticGraph } from "./StaticGraph"
import styles from "./TestCaseLoader.module.css";

export interface TestCaseLoaderProps {
    activate: () => void,
    index: number,
    testCase: TestCase,
    isActive: boolean,
    isComplete: boolean
}
export function TestCaseLoader(props: TestCaseLoaderProps){

    
    return <div className={props.isComplete ? styles.complete : ""}>
        <h2>Test Case {props.index + 1} {props.isActive ? " - ACTIVE" : ""} {props.isComplete ? " - COMPLETE" : ""}</h2>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            <StaticGraph width={"100%"} ctx={props.testCase.initial_graph_provider()} serializer={GraphContext.serializers.bfs} uid={"z" + Math.floor(Math.random() * 100000) + ""}></StaticGraph>
            <div style={{paddingLeft: "1em", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <button style={{fontSize: "2em"}} onClick={props.activate}>Load Test Case {props.index + 1 } &gt;&gt;</button>
            </div>
        </div>
    </div>
}