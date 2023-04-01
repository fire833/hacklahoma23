
type GraphNodeID = string;
export class GraphNode {
	id: GraphNodeID
	value: number = 0;
	neighbors: GraphNodeID[] = [];

	public constructor(id: GraphNodeID) {
		this.id = id;
	}
}

// GraphContext is the primary data structure to store graph execution state.
export class GraphContext {
	graph: {[id: GraphNodeID]: GraphNode} = {};
	active_node_id: GraphNodeID;
	root_node_id: GraphNodeID;

	// TODO implement serializing internal graph state
	// to string w/ DFS here.
	serialize(): string {
		let edge_strings: string[] = [];

		// First, register all nodes
		let node_strings = Object.values(this.graph).map(node => {
			return `${node.id} [label="${node.value}"]`;
		})

		this.bfs((node, visited, queued) => {
			node.neighbors.filter(nid => !visited.has(nid)).forEach(nid => {
				edge_strings.push(`${node.id} -- ${nid}`);
			})
		});

		return `
		graph {
			${node_strings.join("\n")}
			
			${edge_strings.join("\n")}
		}
		`
	}


	bfs(pred: (node: GraphNode, visited: Set<GraphNodeID>, queued: Set<GraphNodeID>) => void) {
		let queue = [this.root_node_id];
		let queued_set = new Set<GraphNodeID>([this.root_node_id]);
		let visited_set = new Set<GraphNodeID>();

		while(queue.length) {
			let popped_id = queue.shift();
			if(!popped_id) {
				throw "Tried to shift on empty queue in BFS";
			};
			let popped_node = this.graph[popped_id];

			// visit popped node
			visited_set.add(popped_id);
			pred(this.graph[popped_id], visited_set, queued_set);

			// enqueue non-queued neighbors
			popped_node.neighbors.filter(id => !queued_set.has(id)).forEach(nid => {
				queue.push(nid);
				queued_set.add(nid);
			})
		}
	}

	get_active(): GraphNode {
		return this.graph[this.active_node_id];
	}

	constructor(nodes: {[id: GraphNodeID]: GraphNode}, root_id: GraphNodeID) {
		this.graph = nodes;
		this.active_node_id = root_id;
		this.root_node_id = root_id;
	}
}
