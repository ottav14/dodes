import Node from './Node.ts';

class Connection {
    a: Node;
    b: Node;

    constructor(a: Node, b: Node) {
        this.a = a;
        this.b = b;
    }
}
export default Connection;
