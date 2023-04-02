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

const LEVEL_NUM = 5;

// REALLY BAD SOLUTION:
// TRAVERSE 0
// travloop: GOTO_IF_EQ finishedtrav: $NUM_NEIGHBORS 1
// TRAVERSE 1
// GOTO travloop:
// finishedtrav: TRAVERSE 0
// SET $MATH_ADD $VALUE $GET_NEIGHBOR $MATH_ADD $NUM_NEIGHBORS -1
// DELETE_NEIGHBOR $MATH_ADD $NUM_NEIGHBORS -1
// addloop: TRAVERSE 0
// SET $MATH_ADD $VALUE $GET_NEIGHBOR $MATH_ADD $NUM_NEIGHBORS -1
// DELETE_NEIGHBOR $MATH_ADD $NUM_NEIGHBORS -1
// GOTO_IF_EQ carrytime: $NUM_NEIGHBORS 1
// GOTO addloop:
// carrytime: TRAVERSE 0
// TRAVERSE 1
// SET_NEIGHBOR 0 $MATH_ADD $GET_NEIGHBOR 0 $MATH_DIV $VALUE 10
// SET $MATH_MOD $VALUE 10
// TRAVERSE 0
// carryloop: SET_NEIGHBOR 0 $MATH_ADD $GET_NEIGHBOR 0 $MATH_DIV $VALUE 10
// SET $MATH_MOD $VALUE 10
// EXIT_IF_EQ $NUM_NEIGHBORS 1
// TRAVERSE 0
// GOTO carryloop:
// 

export function Level5() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 6, ["b", "d"]),
                    "b": new GraphNode("b", 5, ["a", "c", "e"]),
                    "c": new GraphNode("c", 1, ["b", "f"]),
                    "d": new GraphNode("d", 2, ["a"]),
                    "e": new GraphNode("e", 2, ["b"]),
                    "f": new GraphNode("f", 4, ["c"]),
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 3)) throw "Graph output must contain 3 nodes"
                    if (!(graph.graph["a"].value === 8 && graph.graph["b"].value === 7 && graph.graph["c"].value === 5)) throw "Graph output must be 875"
                    return true
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 6, ["b", "d"]),
                    "b": new GraphNode("b", 6, ["a", "c", "e"]),
                    "c": new GraphNode("c", 1, ["b", "f"]),
                    "d": new GraphNode("d", 1, ["a"]),
                    "e": new GraphNode("e", 6, ["b"]),
                    "f": new GraphNode("f", 6, ["c"]),
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 3)) throw "Graph output must contain 3 nodes";
                    if (!(graph.graph["a"].value === 8 && graph.graph["b"].value === 2 && graph.graph["c"].value === 7)) throw "Graph output must be 827";
                    return true
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({
                    "a": new GraphNode("a", 5, ["b", "d"]),
                    "b": new GraphNode("b", 0, ["a", "c", "e"]),
                    "c": new GraphNode("c", 1, ["b", "f"]),
                    "d": new GraphNode("d", 3, ["a"]),
                    "e": new GraphNode("e", 9, ["b"]),
                    "f": new GraphNode("f", 9, ["c"]),
                }, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 3)) throw "Graph output must contain 3 nodes";
                    let root = graph.graph[graph.root_node_id];
                    let next = graph.graph[root.neighbors[0]];
                    let nextnext = graph.graph[next.neighbors[1]];
                    if (!(root.value === 9 && next.value === 0 && nextnext.value === 0)) throw "Graph output must be 900";
                    return true
                },
            ],
        },
    ];
    
    const [loadedTestCase, setLoadedTestCase] = useState(0);
    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    const context = useContext(AppContext);


    function completeCase(number: number) {
        let newCorrectCases = [...correctTestCases, number];
        console.log("Calling completeCase");

        setCorrectTestCases(newCorrectCases);
        if (Array.from(new Set(newCorrectCases)).length === test_cases.length) {
            context.setCompletedLevels([...context.completedLevels, LEVEL_NUM - 1]);
            console.log("Finished all cases, updating context!");
        }
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "📒 Level 5",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 5 - Teaching Addition</h1>
            <p>
                Now that your Wookie friend has mastered counting, he now comes back to you wanting to learn how arithemtic addition works.
                He's curious about getting the sum of multiple sets of skulls of dead Trandoshan lizards (a Wookie's worst enemy) he happens
                to collect on his home planet.
            </p>
            <p>
                You decide to give your Wookie friend a quick tutorial on Earth addition,
                and yet again decide to equip them with a program for all of their Trandoshan accounting needs.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                Your program will begin with a linked list, representing a 3 digit base-10 number.
                This linked list is formed by the 1'th neighbor of every node from root.
                Attached to each of these nodes (at neighbor index 2), is the corresponding
                digit of the other number to add.
            </p>
            <p>
                Your program should take this graph and collapse it down to a linked list of 3 nodes,
                each with one digit of the sum of the two numbers.
            </p>
            <p>
                For example, you may recieve this graph:
            </p>
            <StaticGraph uid={"p5graph"} ctx={new GraphContext({}, "")} serializer={() => {
                return `
                graph {
                    subgraph {
                        rank = same
                        1 [peripheries=2]
                        1 -- 2
                        2 -- 3
                    }

                    subgraph {
                        rank = same
                        4
                        5
                    }

                    1 -- 4
                    2 -- 5
                    3 -- 6
                }
                `
            }}></StaticGraph>

            <p>
                1 is the root node, and has 2 as its index 1 neighbor, and 4 as its index 2 neighbor.
                Your program should output the following graph:
            </p>
            <StaticGraph uid={"p5graph2"} ctx={new GraphContext({}, "")} serializer={() => {
                return `
                graph {
                    subgraph {
                        rank = same
                        5 [peripheries=2]
                        5 -- 7
                        7 -- 9
                    }
                }
                `
            }}></StaticGraph>

            <p>
            Note that the graph will be laid out as a tree,
            but the semantics are the same.
            The equivalent rendering is:
            </p>
            <div style={{marginLeft: "25%"}}>
                <StaticGraph width="50%" uid={"p5graph5"} ctx={new GraphContext({}, "")} serializer={() => {
                    return `
                    graph {
                        1 -- 2
                        1 -- 4
                        2 -- 3
                        2 -- 5
                        3 -- 6
                    }
                    `
                }}></StaticGraph>
            </div>
            <p>
                This is equivalent to 123 + 456 as before.
            </p>
            <p>
                Please refer to the test cases in the test-cases tab in order to get a better idea of what your input graphs will look like, and
                run your code against them to verify functionality. If your graph pane lights up green, then the program ran successfully, and your
                Wookie friend has a new appreciation for decimal addition!
            </p>
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

    return <Level levelIndex={LEVEL_NUM - 1} completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}