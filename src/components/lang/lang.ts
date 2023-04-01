import { languages } from "monaco-editor";

export const LANG = "GraphASM";

export interface FuncDef {

}

export const FunctionDefinitions: { [funcname: string]: FuncDef } = {
    "SET": {

    }
}

export const LANG_DEF: languages.IMonarchLanguage = {
    tokenizer: {
        root: [
            [/^[a-zA-Z]+:/, "tag"],
            [/[A-Z$]\w+/, "keyword"],
            [/\s/, "whitespace"],
            [/#.*/, "comment"]
        ],
    }
}
