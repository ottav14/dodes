import * as GLOBAL from './global.ts';
import * as CONNECTION from './Connection.ts';
import * as CAMERA from './Camera.ts';

class Node {
    x: number;
    y: number;
    value: number | null;
    name: string;
    hovered: boolean;
    selected: boolean;
    connections: Set<Node>;
    startNode: boolean;
    targetNode: boolean;
    pathNode: boolean;

    constructor(x: number, y: number, value: number | null, name: string) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.name = name;
        this.hovered = false;
        this.selected = false;
        this.connections = new Set(); 
        this.startNode = false;
        this.targetNode = false;
        this.pathNode = false;
    }

    display(ctx: CanvasRenderingContext2D) {
        const radius = this.hovered ? 1.1*GLOBAL.NODE_RADIUS : GLOBAL.NODE_RADIUS;
        const camera = CAMERA.getCamera();
        const x = this.x + camera.x;
        const y = this.y + camera.y;
        
        if(this.selected) ctx.strokeStyle = '#00f';
        else if(this.pathNode) ctx.strokeStyle = '#ff0';
        else if(this.startNode) ctx.strokeStyle = '#0f0';
        else if(this.targetNode) ctx.strokeStyle = '#f00';
        else ctx.strokeStyle = '#ededed';

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.lineWidth = GLOBAL.LINE_WIDTH;
        ctx.stroke();
        ctx.fillStyle = '#1f1f1f';
        ctx.fill();

        ctx.fillStyle = this.selected ? '#0000ff' : '#ededed';
        const str = this.value === null ? '' : this.value.toString();
        ctx.fillText(str, x, y);
    }
}
export default Node;

export const createNode = (x: number, y: number, value: number | null, name: string) => {
    const node = new Node(x, y, value, name);
    GLOBAL.nodes.push(node);
    return node;
}

export const deleteNode = (node: Node) => {
    for(let i=0; i<GLOBAL.nodes.length; i++)
        if(GLOBAL.nodes[i] === node)
            GLOBAL.nodes.splice(i, 1);

    for(let i=0; i<GLOBAL.connections.length; i++)
        if(GLOBAL.connections[i].members.has(node))
            CONNECTION.deleteConnection(GLOBAL.connections[i]);

}

