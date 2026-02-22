<script lang="ts">
    import { onMount } from 'svelte';
    import * as GLOBAL from './global.js';
    import * as MATH from './math.ts';
    import Node from './Node.ts';
    import Input from './components/Input.svelte';
    import ItemWidget from './components/ItemWidget.svelte';
    
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    let dpr: number;
    let hoveredNode: Node | null;
    let selectedNode: Node | null;
    let dragging: boolean = false;
    let mx: number;
    let my: number;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let keysHeld = new Set();
    let connections: Node[][] = [];

    const getMousePosition = (e: MouseEvent) => {
        if(canvas) {
            const canvasBoundingRect = canvas.getBoundingClientRect();    
            const mx = e.clientX - canvasBoundingRect.left;
            const my = e.clientY - canvasBoundingRect.top;
            return [ mx, my ];        
        }
        return [];
    }

    const createNode = (x: number, y: number, value: number | null, name: string) => {
        const node = new Node(x, y, value, name);
        GLOBAL.nodes.push(node);
        return node;
    }

    const addConnection = (a: Node, b: Node) => {
        a.connections.push(b);
        b.connections.push(a);
        connections.push([a, b]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        keysHeld.add(e.key);
    }

    const handleKeyUp = (e: KeyboardEvent) => {
        keysHeld.delete(e.key);
    }

    const handleMouseMove = (e: MouseEvent) => {
        let shortestDistance = 10000000;
        let closestNode;
        const [ newMx, newMy ] = getMousePosition(e);
        mx = newMx;
        my = newMy;
        for(const node of GLOBAL.nodes) {
            const d = MATH.distance(node.x, node.y, mx, my);

            if(d < GLOBAL.NODE_RADIUS && d < shortestDistance) {
                shortestDistance = d;
                closestNode = node;
            }
        }
        if(closestNode && !dragging) {
            closestNode.hovered = true;
            hoveredNode = closestNode;
            displayLoop();
        }
        else if(hoveredNode && !dragging) {
            hoveredNode.hovered = false;
            hoveredNode = null;
            displayLoop();
        }
    }

    const handleMouseDown = (e: MouseEvent) => {
        const [ mx, my ] = getMousePosition(e);
        if(keysHeld.has('Control')) {
            if(selectedNode) { 
                selectedNode.selected = false;
                selectedNode = null;
            }

            const node = createNode(mx, my, null, '');
            selectedNode = node;
            node.selected = true;
            node.hovered = true;
            dragging = true;
            displayLoop();
            return;
        }

        if(selectedNode) {
            if(keysHeld.has('Shift') && hoveredNode)
                addConnection(selectedNode, hoveredNode);

            selectedNode.selected = false;
            selectedNode = null;
        }
        if(hoveredNode) {
            dragOffsetX = hoveredNode.x - mx;
            dragOffsetY = hoveredNode.y - my;
            selectedNode = hoveredNode;
            selectedNode.selected = true;
            dragging = true;
        }
        displayLoop();
    }

    const handleMouseUp = () => {
        dragging = false;
    }

    const displayLoop = () => {
        if(canvas && ctx) {
            ctx.fillStyle = '#1f1f1f';
            ctx.fillRect(0, 0, canvas.width/dpr, canvas.height/dpr);

            // Connections
            for(const connection of connections) {
                const a = connection[0];
                const b = connection[1];
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = '#ededed';
                ctx.stroke();
            }

            for(const node of GLOBAL.nodes)
                node.display(ctx);

        }
    }

    const updateLoop = () => {
        if(dragging && hoveredNode) {
            hoveredNode.x = mx + dragOffsetX;
            hoveredNode.y = my + dragOffsetY;
            displayLoop();
        }
        requestAnimationFrame(updateLoop);
    }

    const handleResize = () => {
        if(canvas && ctx) {
            const rect = canvas.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            displayLoop();
        }
    }

    const handleValueChange = (value: string) => {
        if(selectedNode) {
            selectedNode.value = !value.length ? null : parseInt(value);
            displayLoop();
        }
    }

    const handleNameChange = (value: string) => {
        if(selectedNode) {
            selectedNode.name = value;
            displayLoop();
        }
    }

    onMount(() => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if(canvas)
            ctx = canvas.getContext('2d');

        const rect = canvas.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        window.addEventListener('resize',handleResize);

        if(ctx) {
            ctx.scale(dpr, dpr);

            ctx.lineWidth = 3;
            ctx.font = "32px Monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const cw = canvas.width/dpr;
            const ch = canvas.height/dpr;
            createNode(cw/3, ch/2, 10, 'a');
            createNode(2*cw/3, ch/2, 5, 'b');

            displayLoop();
            updateLoop();
        }
    });
</script>

<main>
    <div id="inspectorContainer">
        <p id="inspectorLabel">Inspector</p>
        {#if selectedNode}
            <li class="inspectorItem">
                Name: 
                <Input 
                    value={selectedNode.name}
                    onInput={handleNameChange} 
                />
            </li>
            <li class="inspectorItem">
                Value: 
                <Input 
                    value={selectedNode.value === null ? '' : selectedNode.value.toString()}
                    onInput={handleValueChange} 
                />
            </li>
            {#if selectedNode.connections.length == 0}
                <li class="inspectorItem">Connections:</li>
            {:else}
                <div id="connections">
                    <p>Connections:</p>
                    {#each selectedNode.connections as connection}
                        <ItemWidget label={connection.name} />
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
    <canvas 
        id="canvas" 
        on:mousemove={handleMouseMove} 
        on:mousedown={handleMouseDown}
        on:mouseup={handleMouseUp}
    ></canvas>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 70%;
        background-color: #242424;
    }

    #inspectorContainer {
        width: 15%;
        height: 100%;
        background-color: #1f1f1f;
        margin-right: 1rem;
    }

    #inspectorLabel {
        font-size: 24pt;
        text-align: center;
    }

    .inspectorItem {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        list-style: none;
        font-size: 16pt;
        width: calc(100% - 2rem);
    }

    #connections {
        padding: 1rem;
        font-size: 16pt;
    }

    #canvas {
        width: 70%;
        height: 100%;
    }
</style>

<svelte:window 
    on:keydown={handleKeyDown} 
    on:keyup={handleKeyUp} 
/>
