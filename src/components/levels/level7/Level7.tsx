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

const LEVEL_NUM = 7;

export function Level7() {

    const test_cases: TestCase[] = [
        {
            initial_graph_provider: () => {
                return new GraphContext({"a": new GraphNode("a", 0)}, "a");
            },
            solution_predicates: [
                (graph) => {
                    return (graph.root_node_id === "a" && graph.graph[graph.root_node_id].value === 0 && graph.graph[graph.active_node_id].value === 3)                    
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
        tab_name: "📒 Level 7",
        node: <div style={{ padding: "2%" }}>
            <h1>Level 7 - Password Cracking</h1>
            <p>
                As yet nother day passes constrained to your cell, you eventually hear from your Wookie friend about a potential password
                vulnerability that affects the prison warden's master database password. He says that the <i>pswd</i> (short for password) 
                program has a bug that could allow you to crack the warden's password. With the password, you could update the database records
                to say that your incarceration status is none! You could then be released and on your merry way home!!
            </p>
            <p>
                You begin to tinker with the program, and you realize that the warden's password is actually the sum of the factors of two numbers, 
                which are then themselves summed to acquire the password. It turns out, these input numbers are stored within your program memory!! 
            </p>
            <h4>Goals/Objectives</h4>
            <p>
                The goal for this challenge is to create a linked list of numbers within your graph structure, starting from 0, and going up to 3.
                You can implement this using the <b>BUBBLE</b> and <b>TRAVERSE</b> instructions. You can follow a pattern similar to
            </p>
            <b>BUBBLE N</b>
            <b>TRAVERSE 0</b>
            <p>
                Where N is the number you wish to have within your next node, which should be currentNode + 1. Within your program terminal, and 
                try and run it. If your graph pane lights up green, then the program ran successfully, and your Wookie friend has a new appreciation
                for our counting system!
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