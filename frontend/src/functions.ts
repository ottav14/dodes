import Node from './Node.ts';
import Connection from './Connection.ts';

const getConnectionFromNodes = (a: Node, b: Node, connections: Connection[]) => {
    for(const connection of connections)
        if(connection.members.has(a) && connection.members.has(b))
            return connection

    return null;
}

export const dijkstras = (startNode: Node, targetNode: Node, nodes: Node[], connections: Connection[]) => {
    let currentNode;
    const queue = [startNode];
    const visited = new Set();
    const distances: Record<string, any> = {};
    for(const n of nodes)
        for(const m of nodes)
            if(n !== m)
                distances[`${n.name},${m.name}`] = Infinity;
    distances[`${startNode.name},${startNode.name}`] = 0;

    while(currentNode !== targetNode) {
        currentNode = queue.shift();
        if(currentNode) {
            const currentDistance = distances[`${currentNode.name},${startNode.name}`];
            visited.add(currentNode);
            for(const other of currentNode.connections) {
                if(!visited.has(other)) {
                    queue.push(other);
                    const connection = getConnectionFromNodes(currentNode, other, connections);
                    let d;
                    if(connection?.weight) d = currentDistance + connection?.weight;
                    else d = currentDistance;
                    if(distances[`${currentNode.name},${other.name}`] > d) {
                        distances[`${currentNode.name},${other.name}`] = d;
                        distances[`${other.name},${currentNode.name}`] = d;
                    }
                }
            }
        }
        else
            return;
    }
}
