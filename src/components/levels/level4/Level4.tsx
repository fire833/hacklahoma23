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

const LEVEL_NUM = 4;

// SOLUTION:
//
// BUBBLE 1
// SET $MATH_ADD $VALUE -1
// TRAVERSE 0
// loop: ROOT SET $MATH_ADD $VALUE -1
// BUBBLE $MATH_ADD $VALUE 1
// TRAVERSE 1
// GOTO_IF_NEQ loop: ROOT $VALUE 0

export function Level4() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 16)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 17)) throw "Graph must have 17 nodes";
                    if (!(graph.graph[graph.active_node_id].value === 17 && graph.graph[graph.root_node_id].value === 0)) throw "Graph active node must be at the end of list (value 17) and root node must be 0";
                    return true;
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 13)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 14)) throw "Graph must have 14 nodes";
                    if (!(graph.graph[graph.active_node_id].value === 14 && graph.graph[graph.root_node_id].value === 0)) throw "Graph active node must be at the end of list (value 14) and root node must be 0";
                    return true;
                },
            ],
        },
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 12)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    if (!(Object.values(graph.graph).length === 13)) throw "Graph must have 13 nodes";
                    if (!(graph.graph[graph.active_node_id].value === 13 && graph.graph[graph.root_node_id].value === 0)) throw "Graph active node must be at the end of list (value 13) and root node must be 0";
                    return true;
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
        if(Array.from(new Set(newCorrectCases)).length === test_cases.length) {
            context.setCompletedLevels([...context.completedLevels, LEVEL_NUM - 1]);
            console.log("Finished all cases, updating context!");
        }
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
                You decide to implement an acsending linked-list counter to count from 0 to N this time for your Wookie friend. The input number will be 
                included in the root node and should be decremented while adding new ascending nodes until the root node has a value of 0.
            </p>
            <p>
                All memory graphs have a <i>root node</i>, which is the active node at the start of the program.
                The root node can be accessed from anywhere in the memory graph, and is the only node to have this 
                special property.
            </p>
            <p>
                The <b>ROOT</b> function accepts an entire function call as a single parameter,
                and that entire function call will be evaluated as if the root node is the active node.
                This is very useful. Here are some examples:
            </p>
            <p>
                <b>ROOT TRAVERSE 0</b> # Move to the root node's 0th neighbor
            </p>
            <p>
                <b>SET ROOT $VALUE</b> # Set the current node's value to the root's value
            </p>
            <p>
                <b>SET $MATH_ADD ROOT $VALUE $VALUE</b> # Add the root's value to the current node's value
            </p>
            <p>
                <b>ROOT SET $MATH_ADD $VALUE -1</b> # Deincrement the root node's value
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