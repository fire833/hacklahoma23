import { useState } from "react";
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

const LEVEL_NUM = 4;

export function Level4() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 16)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 16)) throw "Graph must have 16 nodes";
                    return (graph.graph[graph.active_node_id].value === 16 && graph.graph[graph.root_node_id].value === 0)
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 13)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 13)) throw "Graph must have 13 nodes";
                    return (graph.graph[graph.active_node_id].value === 13 && graph.graph[graph.root_node_id].value === 0)
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 12)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 12)) throw "Graph must have 12 nodes";
                    return (graph.graph[graph.active_node_id].value === 12 && graph.graph[graph.root_node_id].value === 0)
                },
            ],
        },
    ];
    const [loadedTestCase, setLoadedTestCase] = useState(0);


    const [correctTestCases, setCorrectTestCases] = useState<number[]>([]);

    function completeCase(number: number) {
        setCorrectTestCases([...correctTestCases, number]);
    }


    const tabs: Tab[] = [{
        tab_kind: "react_node",
        tab_name: "📒 Level 4",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 4 - Teaching Arbitrary Counting (Part 2)</h1>
            <p>
                It is several days later, and your Wookie friend has come up to you again. He says that although the decrementing numbers 
                worked well for his friends for a while, they got fed up with needing to count downwards, and would instead prefer to count upwards.
                He asks you if you can implement an ascending linked-list counter instead.
            </p>
            <p>
                You decide to implement an acsending linked-list counter to count from 0 to N this time for your Wookie friend. 
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to create a linked list of numbers within your graph structure, starting from 0, and going up to N.
                You can implement this using the <b>BUBBLE</b>, <b>TRAVERSE</b>, <b>GOTO_IF_NEQ</b> instructions like before, but you will need to perform
                comparisons to the root node with the <b>ROOT</b> instruction as well. You can follow a pattern similar to the following: 
                You can follow a pattern similar to
            </p>
            <b>loop: BUBBLE $MATH_ADD $VALUE 1</b> <br/>
            <b>TRAVERSE 1</b> <br/>
            <b>GOTO_IF_NEQ $VALUE 0</b> <br/>
            <p>
                Where N is the number you wish to have within your next node, which should be currentNode + 1. Within your program terminal, and 
                try and run it. If your graph pane lights up green, then the program ran successfully, and your Wookie friend can help out his Jawa
                herder friends!
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

    return <Level levelIndex={LEVEL_NUM - 1}  completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}