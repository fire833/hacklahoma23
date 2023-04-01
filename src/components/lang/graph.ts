
export type GraphNodeID = string;

export function NewGraphNodeID(): string {
	return crypto.randomUUID().replace("-", "");
}

export class GraphNode {
	id: GraphNodeID;
	value: number = 0;
	neighbors: GraphNodeID[] = [];

	constructor(id: GraphNodeID, value: number, neighbors: GraphNodeID[])
	constructor(id: GraphNodeID, value: number);
	constructor(id: GraphNodeID);
	constructor(id: GraphNodeID, value?: number, neighbors?: GraphNodeID[]) {
		this.id = id;

		if (neighbors) {
			this.neighbors = neighbors;
		}

		if (value) {
			this.value = value;
		}
	}

	public add_neighbor(id: GraphNodeID) {
		this.neighbors.push(id);
	}

	public remove_neighbor(id: GraphNodeID) {
		let index: number = -1;

		this.neighbors.forEach((v, i, a) => {
			if (v === id) {
				index = i;
			}
		});

		if (index != -1) {
			this.neighbors.splice(index, 1);
		}
	}

	public has_neighbor(find: GraphNodeID): boolean {
		let found = false;

		this.neighbors.forEach((v, i, a) => {
			if (v === find) {
				found = true;
			}
		})

		return found;
	}
}

export type SerializerKey = keyof typeof GraphContext.serializers;

// GraphContext is the primary data structure to store graph execution state.
export class GraphContext {
	graph: { [id: GraphNodeID]: GraphNode } = {};
	active_node_id: GraphNodeID;
	root_node_id: GraphNodeID;

	static serializers = {
		"bfs": (ctx: GraphContext, hovered_node_id: GraphNodeID | null): string => {
			let edge_strings: string[] = [];

			console.log("Called serialize with", ctx, hovered_node_id);


			// First, register all nodes
			let node_strings = Object.values(ctx.graph).map(node => {
				return `${node.id} [label="${node.value}" id="graphnode_${node.id}"]`;
			})

			ctx.bfs((node, visited, queued) => {
				node.neighbors.filter(nid => !visited.has(nid)).forEach(nid => {
					let edge_label = "";
					if (hovered_node_id) {
						let hovered_node = ctx.graph[hovered_node_id];
						if (node.id === hovered_node_id) edge_label = hovered_node.neighbors.indexOf(nid).toString();
						if (nid === hovered_node_id) edge_label = hovered_node.neighbors.indexOf(node.id).toString();
					}
					edge_strings.push(`${node.id} -- ${nid} [${`label="${edge_label}"`}]`);
				})
			});

			return `
			graph {
				${node_strings.join("\n")}
				${edge_strings.join("\n")}
			}
			`
		}
	}

	bfs(pred: (node: GraphNode, visited: Set<GraphNodeID>, queued: Set<GraphNodeID>) => void) {
		let queue = [this.root_node_id];
		let queued_set = new Set<GraphNodeID>([this.root_node_id]);
		let visited_set = new Set<GraphNodeID>();

		while (queue.length) {
			let popped_id = queue.shift();
			if (!popped_id) {
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

	constructor(nodes: { [id: GraphNodeID]: GraphNode }, root_id: GraphNodeID) {
		this.graph = nodes;
		this.active_node_id = root_id;
		this.root_node_id = root_id;
	}

	enter_root_ctx() {

	}

	exit_root_ctx() {

	}

	// public-facing instruction implementations

	// Returns the current u32 stored within the active node.
	public value(): number {
		return this.graph[this.active_node_id].value;
	}

	// Sets active node to the current value of P1.
	public set(P1: number) {
		this.graph[this.active_node_id].value = P1;
	}

	// // Adds P1 and P2 together and returns the result.
	// public math_add(P1: number, P2: number): number {
	// 	return P1 + P2;
	// }

	// // Multiplies P1 and P2 together and returns the result.
	// public math_mult(P1: number, P2: number): number {
	// 	return P1 * P2;
	// }

	// // Divides P1 by P2 and returns the result. Will return the floor of the division.
	// public math_div(P1: number, P2: number): number {
	// 	return P1 / P2;
	// }

	// Append a neighbor to the active node with a preset value of P1.
	public bubble(P1: number) {
		let node = new GraphNode(NewGraphNodeID(), P1);
		this.graph[this.active_node_id].neighbors.push(node.id);
		this.graph[node.id] = node;
	}

	// Set the active node to the neighbor at index P1 of the currently active node. 
	// Returns an error if P1 is not a valid index.
	public traverse(P1: number) {
		this.active_node_id = this.graph[this.active_node_id].neighbors[P1];
	}

	// Returns the number of neighbors attached to the currently active node.
	public num_neighbors(): number {
		return this.graph[this.active_node_id].neighbors.length;
	}

	// Sets neighbor P2 to have the index of P1 and neighbor P1 to have the index of P2.
	public reorder(P1: number, P2: number) {
		let active = this.graph[this.active_node_id];

		let p1val = active.neighbors[P1];
		let p2val = active.neighbors[P2];
		active.neighbors[P1] = p2val;
		active.neighbors[P2] = p1val;
	}

	// Sets the value of the the root node as the value of the current active node. 
	// This does not set the root as the active node.
	public set_root() {
		this.root_node_id = this.active_node_id;
	}

	// Sets the value of neighbor with index P1 to the value P2.
	public set_neighbor(P1: number, P2: number) {
		let neighbor = this.graph[this.active_node_id].neighbors[P1];
		this.graph[neighbor].value = P2;
	}

	// Returns the current value of neighbor with index P1.
	public get_neighbor(P1: number): number {
		let neighbor = this.graph[this.active_node_id].neighbors[P1];
		return this.graph[neighbor].value;
	}

	// Remove the neighbor at index P1 from the graph. All edges of said node 
	// will be removed from the graph and the value of the node will be lost.
	public delete_neighbor(P1: number) {
		let dying_neighbor = this.graph[this.active_node_id].neighbors[P1];

		// this behavior can change later if needed
		if (dying_neighbor === this.root_node_id || dying_neighbor === this.active_node_id) {
			return;
		}

		this.graph[dying_neighbor].neighbors.forEach((v, i, a) => {
			this.graph[v].remove_neighbor(dying_neighbor);
		})

		delete this.graph[dying_neighbor];
	}

	// Remove the neighbor at index P1 from the graph. All neighbors of the cut 
	// node will be connected. For every pair of nodes which were neighbors of 
	// the cut node, a new edge will be created between them if it does not already 
	// exist.
	public cut_neighbor(P1: number) {
		let ctx = this.graph;
		let dying_neighbor = ctx[this.active_node_id].neighbors[P1];

		// this behavior can change later if needed
		if (dying_neighbor === this.root_node_id || dying_neighbor === this.active_node_id) {
			return;
		}

		ctx[dying_neighbor].neighbors.forEach((v, i, a) => {
			ctx[v].remove_neighbor(dying_neighbor);
			ctx[dying_neighbor].neighbors.forEach((v2, i2, a2) => {
				// if () {

				// }
			});

		});
	}
}
