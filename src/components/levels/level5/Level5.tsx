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

const LEVEL_NUM = 5;

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
                    return ((Object.values(graph.graph).length === 3) && graph.graph["a"].value === 8 && graph.graph["b"].value === 7 && graph.graph["c"].value === 5)
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
        tab_name: "📒 Level 5",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 5 - Teaching Addition</h1>
            <p>
                Now that your Wookie friend has mastered counting, he now comes back to you wanting to learn how arithemtic addition works.
                He's curious about getting the sum of multiple sets of skulls of dead Trandoshan lizards (a Wookie's worst enemy) he happens
                to collect on his home planet.
            </p>
            <p>
                You decide to give your Wookie friend a quick tutorial on counting on your computer. You open up a program and begin to 
                show him how to count with the Arabic numerals.
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to sum the values of two linked lists (your graph input), with each node value being the 100s, 
                10s, and 1s place for the input numbers, and output a single linked-list where the combined values equal to the sum.

                For example, if your input linked lists are (1, 2, 3) and (4, 5, 6), that would be equivalent to summing 123 + 456 = 579, and 
                the equivalent output linked-list should be (5, 7, 9). You should be able to handle carries for sums of digits which are greater than
                or equal to 10. Input and output numbers will always be 3 digits in length. Keep this in mind when writing your algorithm.
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

    return <Level levelIndex={LEVEL_NUM - 1}  completeCase={completeCase} completedTestCased={correctTestCases} tabs={tabs} loadedTestCase={loadedTestCase} setLoadedTestCase={setLoadedTestCase} test_cases={test_cases}></Level>
}