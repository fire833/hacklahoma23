

export enum KeybindState {
	Global,
	InEditor,
}


export default class KeybindManager {

	state: KeybindState;

	private keyDownHandler(e: KeyboardEvent) {
		let k = e.key;
		switch (this.state) {
			case KeybindState.Global: {
				break;
			}
		}
	}

	private keyUpHandler(e: KeyboardEvent) {
		let k = e.key;
		switch (this.state) {

		}
	}

	public setState(s: KeybindState) {
		this.state = s;
	}

	constructor() {
		this.state = KeybindState.Global;

		document.addEventListener("keydown", this.keyDownHandler);
		document.addEventListener("keyup", this.keyUpHandler);
		return;
	}
}

export function useKeybindState(): SetKeybindState {
	return (s: KeybindState) => { state.setState(s); };
}

export const state = new KeybindManager();

type SetKeybindState = (s: KeybindState) => void;
