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
    const previous: Record<string, any> = {};
    for(const n of nodes)
        distances[n.name] = Infinity;
    distances[startNode.name] = 0;


    while(queue.length) {
        currentNode = queue.shift();
        if(currentNode && !visited.has(currentNode.name)) {
            const currentDistance = distances[currentNode.name];
            visited.add(currentNode.name);
            const currentConnections = [...currentNode.connections];
            for(const other of currentConnections) {
                if(!visited.has(other.name))
                    queue.push(other);

                const connection = getConnectionFromNodes(currentNode, other, connections);
                const d = connection?.weight ? currentDistance + connection.weight : currentDistance;
                if(distances[other.name] > d) {
                    distances[other.name] = d;
                    previous[other.name] = currentNode.name; 
                }
            }
        }
    }

    let currentName = targetNode.name;
    const path = [];
    while(currentName !== startNode.name) {
        path.unshift(currentName);
        currentName = previous[currentName];
    }
    path.unshift(currentName);
    return [ distances, path ];
}
