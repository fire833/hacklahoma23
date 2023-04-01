import { CancellationToken, Position, Token, editor, languages } from "monaco-editor";
import { GraphContext } from "./graph";

export const LANG = "GraphASM";

export interface ProgramState {
    instruction_pointer: number,
    graph_context: GraphContext
}

export interface FuncDef {
    evaluate: Function,
    num_params: number,
    hover_md_lines?: string[][]
}

type label = string;
type thunk = {
    function_name: string,
    function_def: FuncDef,
    args: ParamType[]
}
export type ValidScalarType = number | label;
export type FunctionReturnType = ValidScalarType | void;
export type ParamType = ValidScalarType | thunk;


export const FunctionDefinitions: { [funcname: string]: FuncDef } = {
    "SET": {
        evaluate: (state: ProgramState, value: number) => {
            state.graph_context.get_active().value = value;
        },
        hover_md_lines: [
            ["Set the value of the active node"],
            [
                "**Example:**",
                "```" + LANG,
                "SET 22 # Sets the active node to 22",
                "```"
            ]
        ],
        num_params: 1
    },
    "$ARITH_ADD": {
        evaluate: (_: ProgramState, a: number, b: number) => {
            return a + b;
        },
        num_params: 2
    },
    "$VALUE": {
        evaluate: (state: ProgramState) => {
            return 77;
        },
        num_params: 0
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

export interface TokenWithValue extends Token {
    value: string,
    source_line: number
}

export const LANG_COMPLETIONS: languages.CompletionItemProvider = {
    provideCompletionItems: function (model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): languages.ProviderResult<languages.CompletionList> {

        let completing_token = model.getWordAtPosition(position);
        let char_before = model.getLineContent(position.lineNumber).charAt((completing_token?.startColumn || 0) - 1 - 1);
        
        console.log("Char before is:", char_before);

        console.log("Called suggestion provider");

        console.log(completing_token, "is completing");
        
        let range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: (completing_token?.startColumn || position.column) + (char_before === "$" ? -1 : 0),
                        endColumn: (completing_token?.endColumn || position.column) + (char_before === "$" ? -1 : 0)
                    }
        
        console.log("Over range", range);
        
        return {
            suggestions: Object.keys(FunctionDefinitions).map(func_name => {
                let item: languages.CompletionItem = {
                    label: func_name,
                    kind: languages.CompletionItemKind.Function,
                    insertText: func_name,
                    range
                }
                return item;
            })
        }
    }
}

export const LANG_HOVER: languages.HoverProvider = {
    provideHover(model, position, cancel_token) {
        let hovered_word = model.getWordAtPosition(position);
        let source_line = model.getLineContent(position.lineNumber);
        let source_line_parsed = augmentLineTokensWithValue(editor.tokenize(source_line, LANG)[0], source_line, position.lineNumber);
        console.log("Source line parsed is ", source_line_parsed);
        console.log("Hovering at position", position);
        
        
        let hovered_token = get_token_at_offset(source_line_parsed, position.column);        
        if(hovered_token === null) {
            return {
                contents: []
            }
        } 

        if (hovered_token.type === `keyword.${LANG}`){
            let hovered_func_name = hovered_token.value;
            let hovered_func_def = FunctionDefinitions[hovered_func_name];
            return {
                contents: [
                    {
                        value: `# Function ${hovered_token.value}`, 
                    },
                    ...(hovered_func_def.hover_md_lines || []).map(lines => {
                        return {
                            value: lines.join("\n")
                        }
                    })
                ]
            }
        }
        console.log("Hovering: ", hovered_token);
        
        return {
            contents: []
        }
        
    },
}

export function augmentLineTokensWithValue(line: Token[], sourceLine: string, source_line_ind: number): TokenWithValue[] {
    let tokensWithValue: TokenWithValue[] = [];

    for (let i = 0; i < line.length - 1; i++) {
        let token = line[i];
        let next_token = line[i + 1];
        let value = sourceLine.substring(token.offset, next_token.offset);
        let tokenWithValue: TokenWithValue = {
            ...token,
            value,
            source_line: source_line_ind
        }
        tokensWithValue.push(tokenWithValue);
    }

    if(line.length > 0) {
        // Handle the last token
        let last_token = line[line.length - 1];
        let last_value = sourceLine.substring(last_token.offset);
        tokensWithValue.push({
            ...last_token,
            value: last_value,
            source_line: source_line_ind
        });
    }

    return tokensWithValue;
}

export interface Instruction {
    label?: string,
    evaluate: (state: ProgramState) => void
}

function filterMeaninglessTokens(line: TokenWithValue[]): TokenWithValue[] {
    let meaningless_types = [`whitespace.${LANG}`, `comment.${LANG}`];
    return line.filter(e => meaningless_types.indexOf(e.type) === -1);
}


function evaluate_params(function_name: string, args: TokenWithValue[]): { params: ParamType[], tokens_consumed: number } {
    let funcdef = FunctionDefinitions[function_name];
    if (funcdef === undefined) throw `Unknown function name passed to evaluate_params ${function_name}`;
    let unsatisfied_params = funcdef.num_params;
    let current_param_idx = 0;

    let evaluated_params: ParamType[] = [];

    while (unsatisfied_params > 0) {
        let current_param = args[current_param_idx];
        if (current_param.type === `constant.${LANG}`) {
            evaluated_params.push(parseInt(current_param.value));
            current_param_idx++;
        } else if (current_param.type === `tag.${LANG}`) {
            evaluated_params.push(current_param.value);
            current_param_idx++;
        } else if (current_param.type === `keyword.${LANG}`) {
            let param_func_name = current_param.value;
            let param_func_def = FunctionDefinitions[param_func_name];
            if (param_func_def === undefined) throw `Unknown function name passed as parameter ${param_func_name}`;

            let { params: param_func_params, tokens_consumed } = evaluate_params(param_func_name, args.slice(current_param_idx + 1));

            let param_thunk: thunk = {
                function_name: param_func_name,
                function_def: param_func_def,
                args: param_func_params
            };
            evaluated_params.push(param_thunk);

            console.log(`Evaluating function param ${param_func_name} consumed ${tokens_consumed} tokens`);
            

            current_param_idx += tokens_consumed + 1;
        } else {
            // throw `Unexpected token type`
        }
        unsatisfied_params--;
    }

    return {
        params: evaluated_params,
        tokens_consumed: current_param_idx
    }

}

function parseLine(line: TokenWithValue[]): Instruction {

    let current_token_idx = 0;


    // Handle the label first
    let label: string | undefined;
    if (line[current_token_idx].type === `tag.${LANG}`) {
        label = line[current_token_idx].value;
        current_token_idx++;
    }

    // Then the function name
    let function_token = line[current_token_idx];
    if (function_token.type !== `keyword.${LANG}`) {
        throw `Expected a function name, got ${function_token.type}`;
    }
    let function_name = line[current_token_idx].value;
    let function_definition = FunctionDefinitions[function_name];

    current_token_idx++;


    let { params, tokens_consumed } = evaluate_params(function_name, line.slice(current_token_idx))
    console.log(`Resolved params:`, params);


    return {
        evaluate: (state: ProgramState) => {
            return apply(function_definition, params, state);
        },
        label
    }
}

type Program = Instruction[];

export const compile = (source: string): Program => {
    let source_lines = source.split("\n");
    let tokens = editor.tokenize(source, LANG);
    let tokensWithValue = tokens.map((line, ind) => augmentLineTokensWithValue(line, source_lines[ind], ind));

    let meaningfulTokens = tokensWithValue.map(line => filterMeaninglessTokens(line));
    console.log("compiled to", meaningfulTokens);

    let filteredBlankLines = meaningfulTokens.filter(e => e.length);

    let program = filteredBlankLines.map(parseLine);

    return program;
}


export const apply = (def: FuncDef, params: ParamType[], state: ProgramState): ValidScalarType => {
    let applied_params = params.map(p => typeof p === "object" ? apply(p.function_def, p.args, state) : p);
    console.log("Applying function with def", def, "with params", applied_params);

    return def.evaluate(state, ...applied_params);
}

export const run = (program: Program, initial_state: ProgramState, set_graph: (ctx: GraphContext) => void) => {

    console.log("Running program: ", program);
    
    let state = { ...initial_state };

    while (state.instruction_pointer < program.length) {
        let instruction = program[state.instruction_pointer];
        state.instruction_pointer++;
        instruction.evaluate(state);
        console.log("State after eval is:", state);
        set_graph(state.graph_context);
    }
}

languages.register({
    id: LANG
})
languages.setMonarchTokensProvider(LANG, LANG_DEF);

function get_token_at_offset(source_line_parsed: TokenWithValue[], column: number) {
    if(source_line_parsed.length === 0) return null;
    let last_token = source_line_parsed[0];
    for(let t of source_line_parsed) {
        if (t.offset >= column) return last_token;
        last_token = t; 
    }
    return source_line_parsed[source_line_parsed.length - 1];
}
