import Node from './Node.ts';
import Connection from './Connection.ts';

export const NODE_RADIUS: number = 50;
export const CONNECTION_HOVER_DIST: number = 50;
export const LINE_WIDTH = 3;
export let nodes: Node[] = [];
export let connections: Connection[] = [];
export let saving = false;
export const setSaving = (val: boolean) => saving = val;
export const getSaving = () => saving;

export const setNodes = (newNodes: Node[]) => nodes = newNodes;
export const setConnections = (newConnections: Connection[]) => connections = newConnections;
