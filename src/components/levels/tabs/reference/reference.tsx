import { Tab_ReactNode } from "../../level/Level";

export const ReferenceTab: Tab_ReactNode = {
	tab_name: "🔎 Reference",
	tab_kind: "react_node",
	node: (
		<div style={{ padding: "2%" }}>
			<h3>Instruction Index</h3>
			<h4>Managing active node</h4>
			<p><b>$VALUE</b> Returns the current u32 stored within the active node.</p>
			<p><b>SET P1</b> Sets active node to the current value of P1.</p>
			<p><b>$MATH_ADD P1 P2</b> Adds P1 and P2 together and returns the result.</p>
			<p><b>$MATH_MULT P1 P2</b> Multiplies P1 and P2 together and returns the result.</p>
			<p><b>$MATH_DIV P1 P2</b> Divides P1 by P2 and returns the result. Will return the floor of the division.</p>
			<p><b>$MATH_MOD P1 P2</b> Divides P1 by P2 and returns the remainder of the division.</p>
			<p><b>BUBBLE P1</b> Append a neighbor to the active node with a preset value of P1.</p>
			<p><b>TRAVERSE P1</b> Set the active node to the neighbor at index P1 of the currently active node. Returns an error if P1 is not a valid index.</p>
			<p><b>$NUM_NEIGHBORS</b> Returns the number of neighbors attached to the currently active node.</p>
			<p><b>REORDER P1 P2</b> Sets neighbor P2 to have the index of P1 and neighbor P1 to have the index of P2.</p>
			<h4>Dealing with the root node of the program</h4>
			<p><b>ROOT P1</b> Runs instruction P1 as if the root node is the active node. It does this without changing the currently active node.</p>
			<p><b>SET_ROOT</b> Sets the value of the the root node as the value of the current active node. This does not set the root as the active node.</p>
			<h4>Flow control</h4>
			<p><b>GOTO P1</b> Jumps to the label P1 and continues execution at the next instruction.</p>
			<p><b>EXIT_IF_EQ P1 P2</b> Exits the current running program if P1 and P2 are equal.</p>
			<p><b>EXIT_IF_NEQ P1 P2</b> Exits the currently runnning program if P1 and P2 are not equal.</p>
			<p><b>GOTO_IF_EQ P1 P2 P3</b> Jumps to label P1 if P2 and P3 are equal.</p>
			<p><b>GOTO_IF_NEQ P1 P2 P3</b> Jumps to label P1 if P2 and P3 are not equal.</p>
			<h4>Modifying neighbors</h4>
			<p><b>SET_NEIGHBOR P1 P2</b> Sets the value of neighbor with index P1 to the value P2. </p>
			<p><b>$GET_NEIGHBOR P1</b> Returns the current value of neighbor with index P1.</p>
			<p><b>DELETE_NEIGHBOR P1</b> Remove the neighbor at index P1 from the graph. All edges of said node will be removed from the graph and the value of the node will be lost.</p>
			<p><b>CUT_NEIGHBOR P1</b> Remove the neighbor at index P1 from the graph. All neighbors of the cut node will be connected. For every pair of nodes which were neighbors of the cut node, a new edge will be created between them if it does not already exist.</p>
			{/* <p><b> </b> </p> */}
		</div>
	),
};
