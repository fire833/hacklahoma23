
export class GraphNode {
	id: number
	value: number = 0;
	neighbors: number[] = [];

	public constructor(id: number) {
		this.id = id;
	}
}

// GraphContext is the primary data structure to store graph execution state.
export class GraphContext {
	graph: GraphNode[] = [];


	// TODO implement serializing internal graph state
	// to string w/ DFS here.
	serialize(): string {
		return "";
	}

	constructor(nodes: GraphNode[]) {
		this.graph = nodes;
	}
}
