import * as GLOBAL from './global.ts';
import Connection from './Connection.ts';

class Node {
    x: number;
    y: number;
    value: number | null;
    name: string;
    hovered: boolean;
    selected: boolean;
    connections: Set<Node>;

    constructor(x: number, y: number, value: number | null, name: string) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.name = name;
        this.hovered = false;
        this.selected = false;
        this.connections = new Set(); 
    }

    display(ctx: CanvasRenderingContext2D) {
        const radius = this.hovered ? 1.1*GLOBAL.NODE_RADIUS : GLOBAL.NODE_RADIUS;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2*Math.PI);
        ctx.strokeStyle = this.selected ? '#0000ff' : '#ededed';
        ctx.lineWidth = GLOBAL.LINE_WIDTH;
        ctx.stroke();
        ctx.fillStyle = '#1f1f1f';
        ctx.fill();

        ctx.fillStyle = this.selected ? '#0000ff' : '#ededed';
        const str = this.value === null ? '' : this.value.toString();
        ctx.fillText(str, this.x, this.y);
    }
}
export default Node;
