import { languages } from "monaco-editor";

export const LANG = "GraphASM";

export interface ProgramState {

}

export interface FuncDef {
    evaluate: (state: ProgramState) => void
}

export const FunctionDefinitions: { [funcname: string]: FuncDef } = {
    "SET": {
        evaluate: (state: ProgramState) => {
            
        }
    }
}

export const LANG_DEF: languages.IMonarchLanguage = {
    keywords: Object.keys(FunctionDefinitions),
    tokenizer: {
        root: [
            [/^[a-zA-Z]+:/, "tag"],
            [/-?[0-9]+/, "constant"],
            [/[A-Z$]\w+/, {
                cases: {
                    '@keywords': 'keyword',
                    'default': 'invalid'
                }
            }],
            [/\s/, "whitespace"],
            [/#.*/, "comment"]
        ],
    }
}


export const compile = (source: string) => {
    
}
