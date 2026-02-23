import Node from './Node.ts';
import * as GLOBAL from './global.ts';

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
    a: Node;
    b: Node;
    weight: number | null;
    hovered: boolean;
    selected: boolean;

    constructor(a: Node, b: Node, weight: number | null = null) {
        this.a = a;
        this.b = b;
        this.weight = weight;
        this.hovered = false;
        this.selected = false;
    }

    display(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.hovered ? 5 : GLOBAL.LINE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.strokeStyle = '#ededed';
        ctx.strokeStyle = this.selected ? '#00f' : '#ededed';
        ctx.stroke();

        if(this.weight) {
            const midX = (this.a.x + this.b.x) / 2;
            const midY = (this.a.y + this.b.y) / 2;
            const spacing = 20;

            const dx = this.b.x - this.a.x;
            const dy = this.b.y - this.a.y;
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
