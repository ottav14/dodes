import Node from './Node.ts';
import Connection from './Connection.ts';
import * as GLOBAL from './global.ts';
import * as MATH from './math.ts';
import * as NODE from './Node.ts';
import * as CONNECTION from './Connection.ts';
import * as CAMERA from './Camera.ts';

let keysHeld = new Set();
let dragging: boolean = false;
let hoveredNode: Node | null;
let hoveredConnection: Connection | null;
let selectedNode: Node | null;
let selectedConnection: Connection | null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let mx: number;
let my: number;

export const getSelectedNode = () => selectedNode;
export const getSelectedConnection = () => selectedConnection;

const getMousePosition = (e: MouseEvent) => {
    const canvas = document.getElementById('canvas');
    if(canvas) {
        const camera = CAMERA.getCamera();
        const canvasBoundingRect = canvas.getBoundingClientRect();    
        const mx = e.clientX - canvasBoundingRect.left - camera.x;
        const my = e.clientY - canvasBoundingRect.top - camera.y;
        return [ mx, my ];        
    }
    return [];
}

export const handleKeyDown = (e: KeyboardEvent) => {
    keysHeld.add(e.key);
}

export const handleKeyUp = (e: KeyboardEvent) => {
    keysHeld.delete(e.key);
}

export const inputLoop = () => {
    if(dragging && hoveredNode) {
        hoveredNode.x = mx + dragOffsetX;
        hoveredNode.y = my + dragOffsetY;
    }
}

export const handleMouseUp = () => {
    dragging = false;
}

export const handleMouseMove = (e: MouseEvent) => {
    let shortestNodeDist = 10000000;
    let closestNode;
    let shortestConnectionDist = 10000000;
    let closestConnection;
    const [ newMx, newMy ] = getMousePosition(e);
    mx = newMx;
    my = newMy;
    for(const node of GLOBAL.nodes) {
        const nodeDist = MATH.distance(node.x, node.y, mx, my);
        if(nodeDist < GLOBAL.NODE_RADIUS && nodeDist < shortestNodeDist) {
            shortestNodeDist = nodeDist;
            closestNode = node;
        }
    }
    if(closestNode && !dragging) {
        closestNode.hovered = true;
        hoveredNode = closestNode;
    }
    else if(hoveredNode && !dragging) {
        hoveredNode.hovered = false;
        hoveredNode = null;
    }

    for(const connection of GLOBAL.connections) {
        const a = connection.a;
        const b = connection.b;
        if(a && b) {
            const connectionDist = MATH.pointToLine(a.x, a.y, b.x, b.y, mx, my);
            if(connectionDist < GLOBAL.CONNECTION_HOVER_DIST && connectionDist < shortestConnectionDist) {
                shortestConnectionDist = connectionDist;
                closestConnection = connection;
            }
        }
    }
    if(closestConnection && !hoveredNode) {
        hoveredConnection = closestConnection;
        hoveredConnection.hovered = true;
    }
    else if(hoveredConnection) {
        hoveredConnection.hovered = false;
        hoveredConnection = null;
    }

    if(!selectedNode && !selectedConnection && dragging) {
        CAMERA.moveCamera(e.movementX, e.movementY);
    }
}

export const handleMouseDown = (e: MouseEvent) => {
    const [ mx, my ] = getMousePosition(e);
    dragging = true;
    if(selectedConnection) {
        selectedConnection.selected = false;
        selectedConnection = null;
    }
    if(keysHeld.has('Control')) {
        if(selectedNode) { 
            selectedNode.selected = false;
            selectedNode = null;
        }

        const node = NODE.createNode(mx, my, null, '');
        selectedNode = node;
        node.selected = true;
        node.hovered = true;
        return;
    }

    if(selectedNode) {
        if(keysHeld.has('Shift') && hoveredNode)
            CONNECTION.addConnection(selectedNode, hoveredNode);

        selectedNode.selected = false;
        selectedNode = null;
    }
    if(hoveredNode) {
        dragOffsetX = hoveredNode.x - mx;
        dragOffsetY = hoveredNode.y - my;
        selectedNode = hoveredNode;
        if(selectedNode)
            selectedNode.selected = true;
    }
    else if(hoveredConnection) {
        selectedConnection = hoveredConnection;
        if(selectedConnection)
            selectedConnection.selected = true;
    }
}

export const handleDeleteButton = () => {
    if(selectedNode) {
        NODE.deleteNode(selectedNode)
        selectedNode = null;
    }
    else if(selectedConnection) {
        CONNECTION.deleteConnection(selectedConnection);
        selectedConnection = null;
    }
}

export const handleWidgetDelete = (a: Node | null, b: Node | null) => {
    for(const connection of GLOBAL.connections) {
        if(connection.a === a && connection.b === b ||
           connection.b === a && connection.a === b) {
            CONNECTION.deleteConnection(connection);    
        if(selectedNode)
            selectedNode.connections = new Set(selectedNode.connections);
        break;
        }
    }
}

export const handleWeightChange = (value: string) => {
    if(selectedConnection)
        selectedConnection.weight = value.length ? parseInt(value) : null;
}


export const handleValueChange = (value: string) => {
    if(selectedNode)
        selectedNode.value = !value.length ? null : parseInt(value);
}

export const handleNameChange = (value: string) => {
    if(selectedNode)
        selectedNode.name = value;
}
