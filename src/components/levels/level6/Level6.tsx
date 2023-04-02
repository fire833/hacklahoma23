import { useContext, useState } from "react";
import EditorPane from "../../editor/editor_pane";
import ResultsPane from "../../results/results_pane";
import { editor } from "monaco-editor";
import { GraphContext, GraphNode, SerializerKey } from "../../lang/graph";
import { useMonaco } from "@monaco-editor/react";
import { TestCase, compile } from "../../lang/lang";
import levelStyles from "../levels.module.css";
import { LevelHeader } from "../LevelHeader";
import { Level, Tab } from "../level/Level";
import { TestCaseLoader } from "../TestCaseLoader";
import { ReferenceTab } from "../tabs/reference/reference";
import { EditorTab } from "../tabs/editor/editor";
import { AppContext } from "../../../context/context";
import { StaticGraph } from "../StaticGraph";

const LEVEL_NUM = 6;    


/* Solution:
BUBBLE 2
TRAVERSE 0
rangeloop: BUBBLE $MATH_ADD $VALUE 1
TRAVERSE 1
GOTO_IF_EQ rangedone: $VALUE ROOT $VALUE
GOTO rangeloop:
rangedone: BUBBLE 0
TRAVERSE 0
factorloop: BUBBLE $MATH_MOD ROOT $VALUE $VALUE
GOTO_IF_EQ donefactor: $NUM_NEIGHBORS 2
TRAVERSE 0
GOTO factorloop:

donefactor: SET 1
DELETE_NEIGHBOR 1
TRAVERSE 0
filterloop: GOTO_IF_EQ keep: $GET_NEIGHBOR 2 0
GOTO remove:
keep: DELETE_NEIGHBOR 2
TRAVERSE 1
GOTO cleanup:
remove: DELETE_NEIGHBOR 2
TRAVERSE 1
CUT_NEIGHBOR 0
GOTO_IF_NEQ skipreorder: $NUM_NEIGHBORS 3
REORDER 2 1
REORDER 0 1
GOTO cleanup:

cleanup: EXIT_IF_EQ $NUM_NEIGHBORS 1
GOTO filterloop:


skipreorder: DELETE_NEIGHBOR 0
 
*/

export function Level6() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 6, [])
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    let one = graph.graph[graph.root_node_id];
                    if (one.value !== 1) throw "The first factor should be 1";

                    let two = graph.graph[one.neighbors[0]]
                    if (two.value !== 2) throw "The second factor should be 2";

                    let three = graph.graph[two.neighbors[1]]
                    if (three.value !== 3) throw "The third factor should be 3";

                    let six = graph.graph[three.neighbors[1]]
                    if (six.value !== 6) throw "The last factor should be 6";

                    return true;
                },
            ],
        }, {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 12, [])
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    let one = graph.graph[graph.root_node_id];
                    if (one.value !== 1) throw "The first factor should be 1";

                    let two = graph.graph[one.neighbors[0]]
                    if (two.value !== 2) throw "The second factor should be 2";

                    let three = graph.graph[two.neighbors[1]]
                    if (three.value !== 3) throw "The third factor should be 3";
                    
                    let four = graph.graph[three.neighbors[1]]
                    if (four.value !== 4) throw "The fourth factor should be 4";

                    let six = graph.graph[four.neighbors[1]]
                    if (six.value !== 6) throw "The last factor should be 6";

                    return true;
                },
            ],
        }, {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 48, [])
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    let last = graph.graph[graph.root_node_id];

                    if(last.value !== 1) throw "The first factor must be 1";
                    last = graph.graph[last.neighbors[0]];

                    let factors = [];
                    for(let i = 2; i <= 48; i++){
                        if(48 % i === 0) factors.push(i);
                    }

                    for(let f of factors) {
                        if (last.value !== f) {
                            throw "Missing or misplaced factor " + f;
                        }
                        last = graph.graph[last.neighbors[1]];
                    }

                    // let one = graph.graph[graph.root_node_id];
                    // if (one.value !== 1) throw "The first factor should be 1";

                    // let two = graph.graph[one.neighbors[0]]
                    // if (two.value !== 2) throw "The second factor should be 2";

                    // let three = graph.graph[two.neighbors[1]]
                    // if (three.value !== 3) throw "The third factor should be 3";
                    
                    // let four = graph.graph[three.neighbors[1]]
                    // if (four.value !== 4) throw "The fourth factor should be 4";

                    // let six = graph.graph[four.neighbors[1]]
                    // if (six.value !== 6) throw "The last factor should be 6";

                    return true;
                },
            ],
        }
    ];
    const [loadedTestCase, setLoadedTestCase] = useState(0);


    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    
    const context = useContext(AppContext);


    function completeCase(number: number) {
        let newCorrectCases = [...correctTestCases, number];
        console.log("Calling completeCase");
        
        setCorrectTestCases(newCorrectCases);
        if(Array.from(new Set(newCorrectCases)).length === test_cases.length) {
            context.setCompletedLevels([...context.completedLevels, LEVEL_NUM - 1]);
            console.log("Finished all cases, updating context!");
        }
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "📒 Level 6",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 6 - X Factor </h1>
            <p> 
                Your wookie friend is becoming increasingly interested in your math lessons,
                and has checked out a dusty hologram of an arithmetic class on Earth.
                The wookie made it as far as factoring a number, but had some difficulty.
                No matter! You know just the thing.
                You rush to your cell to crank out a program to factor a number.
            </p>
            <p>
                Before you can even leave the lunch table, the wookie grabs your arm.
                They lean over and whisper a dark secret into your ear - 
                it's not math they've been so fascinated by, it's escaping!
                The wookie relays that <i>the warden's master key is merely a list of all the factors of some number! </i>
                Now you really want to write that program!
                You tear off to your cell and fire away at the holographic keyboard.
            </p>
            <h4>Objective</h4>
            <p>
                Your program will begin with a single node of value N.
                You should output a linked list of factors of N.
            </p>
            <p>
                For example, you may receive as input:
            </p>
            
            <div style={{marginLeft: "25%"}}>
                <StaticGraph uid={"p6graph"} width={"50%"} ctx={new GraphContext({}, "")} serializer={() => {
                    return `
                    graph {
                        6 [peripheries=2]
                    }
                    `
                }}></StaticGraph>
            </div>

            <p>
                And your output should be:
            </p>
            
            <div style={{marginLeft: "10%"}}>
                <StaticGraph uid={"p6graph2"} width={"80%"} ctx={new GraphContext({}, "")} serializer={() => {
                    return `
                    graph{
                        subgraph {
                        rank = same
                        1 [peripheries=2]
                        1 -- 2
                        2 -- 3
                        3 -- 6
                    }
                }`
                }}></StaticGraph>
            </div>
        </div>
    }, EditorTab,
    {
        tab_kind: "react_node",
        tab_name: "🧪 Test Cases",
        node: <div style={{ padding: "1em" }}>
            {test_cases.map((e, ind) => <div>
                <TestCaseLoader activate={() => setLoadedTestCase(ind)} index={ind} testCase={e} isActive={loadedTestCase === ind} isComplete={correctTestCases.indexOf(ind) !== -1}></TestCaseLoader>
            </div>)}
        </div>
    }, ReferenceTab
    ];

    return <Level levelIndex={LEVEL_NUM - 1}  completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}