import Node from './Node.ts';
import Connection from './Connection.ts';

export const NODE_RADIUS: number = 50;
export const CONNECTION_HOVER_DIST: number = 50;
export const LINE_WIDTH = 3;
export let nodes: Node[] = [];
export let connections: Connection[] = [];

export let mode: string | null = null;
export const setMode = (val: string | null) => mode = val;
export const getMode = () => mode;

export const setNodes = (newNodes: Node[]) => nodes = newNodes;
export const setConnections = (newConnections: Connection[]) => connections = newConnections;
