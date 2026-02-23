import Node from './Node.ts';
import * as GLOBAL from './global.ts';
import * as CAMERA from './Camera.ts';

export const addConnection = (a: Node, b: Node) => {
    a.connections.add(b);
    b.connections.add(a);
    GLOBAL.connections.push(new Connection(a, b));
}

export const deleteConnection = (connection: Connection) => {
    for(let i=0; i<GLOBAL.connections.length; i++) {
        if(GLOBAL.connections[i] === connection) {
            GLOBAL.connections.splice(i, 1);
            connection.a.connections.delete(connection.b);
            connection.b.connections.delete(connection.a);
        }
    }
}

class Connection {
    members: Set<Node>;
    a: Node;
    b: Node;
    weight: number | null;
    hovered: boolean;
    selected: boolean;

    constructor(a: Node, b: Node, weight: number | null = null) {
        this.members = new Set();
        this.members.add(a);
        this.members.add(b);
        this.a = a;
        this.b = b;
        this.weight = weight;
        this.hovered = false;
        this.selected = false;
    }

    display(ctx: CanvasRenderingContext2D) {
        const camera = CAMERA.getCamera();
        const ax = this.a.x + camera.x;
        const ay = this.a.y + camera.y;
        const bx = this.b.x + camera.x;
        const by = this.b.y + camera.y;
        ctx.lineWidth = this.hovered ? 5 : GLOBAL.LINE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = '#ededed';
        ctx.strokeStyle = this.selected ? '#00f' : '#ededed';
        ctx.stroke();

        if(this.weight) {
            const midX = (ax + bx) / 2;
            const midY = (ay + by) / 2;
            const spacing = 20;

            const dx = bx - ax;
            const dy = by - ay;
            const mag = Math.sqrt(dx*dx + dy*dy);
            const nx = dy / mag;
            const ny = -dx / mag;

            const x = midX + nx*spacing;
            const y = midY + ny*spacing;
            ctx.fillStyle = '#ededed';
            ctx.fillText(this.weight.toString(), x, y);
        }
    }
}
export default Connection;
