<script lang="ts">
    import { onMount } from 'svelte';
    import * as GLOBAL from './global.ts';
    import * as INPUT from './input.ts';
    import Connection from './Connection.ts';
    import Node from './Node.ts';
    import * as NODE from './Node.ts';
    import * as CONNECTION from './Connection.ts';
    import Input from './components/lib/Input.svelte';
    import ItemWidget from './components/lib/ItemWidget.svelte';
    import SaveModal from './components/SaveModal.svelte';
    import WarningModal from './components/WarningModal.svelte';
    import SVGButton from './components/SVGButton.svelte';
    import Dropdown from './components/lib/Dropdown.svelte';
    import * as FUNCTIONS from './functions.ts';

    let selectedNode: Node | null = null;
    let selectedConnection: Connection | null = null;
    let startNode: Node | null = null;
    let targetNode: Node | null = null;
    let saving = false;
    let warning = false;

    const algorithms = [ 'Dijkstra', 'A*' ];
    let algorithm = algorithms[0];

    const handleResize = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if(canvas && ctx) {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.lineWidth = GLOBAL.LINE_WIDTH;
            ctx.font = "32px Monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
        }
    }

    const displayLoop = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        selectedNode = INPUT.getSelectedNode();
        selectedConnection = INPUT.getSelectedConnection();
        saving = GLOBAL.getMode() === 'saving';

        INPUT.inputLoop();
        if(canvas && ctx) {
            ctx.fillStyle = '#242424';
            ctx.fillRect(0, 0, canvas.width/dpr, canvas.height/dpr);

            for(const connection of GLOBAL.connections)
                connection.display(ctx);

            for(const node of GLOBAL.nodes)
                node.display(ctx);

        }
        requestAnimationFrame(displayLoop);
    }

    const setStartNode = (name: string) => {
        if(startNode) {
            startNode.startNode = false;
            startNode = null;
        }
        for(const node of GLOBAL.nodes) {
            if(node.name === name) {
                startNode = node;
                node.startNode = true;
            }
        }
    }

    const setTargetNode = (name: string) => {
        if(targetNode) {
            targetNode.targetNode = false;
            targetNode = null;
        }
        for(const node of GLOBAL.nodes) {
            if(node.name === name) {
                targetNode = node;
                node.targetNode = true;
            }
        }
    }

    const updateEndNodes = () => {
        for(const node of GLOBAL.nodes) {
            if(node.startNode) startNode = node;
            if(node.targetNode) targetNode = node;
        }
    }

    const getNodeByName = (name: string) => {
        for(const node of GLOBAL.nodes)
            if(node.name === name)
                return node;
        return null;
    }

    const playFunction = () => {
        warning = false;
        updateEndNodes();
        switch(algorithm) {
            case 'Dijkstra':
                for(const node of GLOBAL.nodes) 
                    node.value = null;
                if(startNode && targetNode) {
                    let [ distances, path ] = FUNCTIONS.dijkstras(startNode, targetNode, GLOBAL.nodes, GLOBAL.connections);
                    if(distances) {
                        for(const name of Object.keys(distances)) {
                            const node = getNodeByName(name);
                            if(node)
                                node.value = (distances as Record<string, any>)[name];
                        }

                        const pathNodes = [];
                        for(const name of path as string[]) {
                            const node = getNodeByName(name);
                            if(node) {
                                pathNodes.push(node);
                                node.pathNode = true;
                            }
                        }

                        for(const connection of GLOBAL.connections) {
                            let aIsPath = false;
                            let bIsPath = false;
                            for(const node of pathNodes) {
                                if(node === connection.a) aIsPath = true;
                                if(node === connection.b) bIsPath = true;
                                if(aIsPath && bIsPath) break;
                            }
                            if(aIsPath && bIsPath)
                                connection.path = true;
                        }
                    }
                }
                break;
            case 'A*':
                break;
        }
    }

    const warn = () => {
        warning = true;
    }

    onMount(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        window.addEventListener('resize',handleResize);

        if(ctx) {
            ctx.scale(dpr, dpr);

            ctx.lineWidth = GLOBAL.LINE_WIDTH;
            ctx.font = "32px Monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const cw = canvas.width/dpr;
            const ch = canvas.height/dpr;
            const a = NODE.createNode(cw/3, ch/2, 10, 'a');
            const b = NODE.createNode(1.5*cw/3, ch/2, 5, 'b');
            const c = NODE.createNode(2*cw/3, ch/2, 5, 'c');

            CONNECTION.addConnection(a, b, 1);
            CONNECTION.addConnection(b, c, 2);

            startNode = a;
            a.startNode = true;

            targetNode = c;
            c.targetNode = true;

            FUNCTIONS.dijkstras(a, c, GLOBAL.nodes, GLOBAL.connections);
            displayLoop();

        }
    });
</script>

<main>
    {#if saving}
        <SaveModal />
    {/if}
    {#if warning}
        <WarningModal 
            onClose={() => warning = false} 
            onConfirm={playFunction}
        />
    {/if}
    {#if selectedConnection || selectedNode}
        <div id="inspectorContainer">
            <p class="panelLabel">Inspector</p>
            {#if selectedNode}
                <li class="inspectorItem">
                    Name: 
                    <Input 
                        value={selectedNode.name}
                        onInput={INPUT.handleNameChange} 
                    />
                </li>
                <li class="inspectorItem">
                    Value: 
                    <Input 
                        value={selectedNode.value === null ? '' : selectedNode.value.toString()}
                        onInput={INPUT.handleValueChange} 
                    />
                </li>
                {#if selectedNode.connections.size == 0}
                    <li class="inspectorItem">Connections:</li>
                {:else}
                    <div id="connections">
                        <p>Connections:</p>
                        {#each selectedNode.connections as connection}
                            <ItemWidget label={connection.name} onDelete={() => INPUT.handleWidgetDelete(selectedNode, connection)} />
                        {/each}
                    </div>
                {/if}
            {/if}
            {#if selectedConnection}
                <li class="inspectorItem">
                    Weight: 
                    <Input 
                        value={selectedConnection.weight === null ? '' : selectedConnection.weight.toString()}
                        onInput={INPUT.handleWeightChange} 
                    />
                </li>
            {/if}
            <button id="deleteButton" on:click={INPUT.handleDeleteButton}>
                Delete
            </button>
        </div>
    {/if}
    <canvas 
        id="canvas" 
        on:mousemove={INPUT.handleMouseMove} 
        on:mousedown={INPUT.handleMouseDown}
        on:mouseup={INPUT.handleMouseUp}
    ></canvas>
    <div id="left">
        <div id="toolbar">
            <SVGButton 
                title="Save"
                path="m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z"
                onClick={() => GLOBAL.setMode('saving')}
            />
        </div>
        <div id="functionsContainer">
            <p class="panelLabel">Functions</p>
            <div id="functionOptions">
                <Dropdown 
                     items={algorithms} 
                     onChange={(val) => algorithm = val}
                 />
                <li class="inspectorItem">
                    Start node: 
                    <Input 
                        onInput={(val) => setStartNode(val)} 
                    />
                </li>
                <li class="inspectorItem">
                    Target node: 
                    <Input 
                        onInput={(val) => setTargetNode(val)} 
                    />
                </li>
            </div>
            <SVGButton 
                title="Play"
                path="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"
                onClick={warn}
            />
        </div>
        <div id="functionsContainer">
            <p class="panelLabel">Functions</p>
            <Dropdown 
                value={algorithms[0]} 
                items={algorithms} 
            />
            <div id="functionOptions">
                <li class="inspectorItem">
                    Start node: 
                    <Input 
                        value=''
                        onInput={(val) => {
                            if(startNode)
                                startNode.startNode = false;
                            startNode = getNodeFromName(val); 
                            if(startNode)
                                startNode.startNode = true;
                        }}
                    />
                </li>
                <li class="inspectorItem">
                    End node: 
                    <Input 
                        value=''
                        onInput={(val) => {
                            if(targetNode)
                                targetNode.targetNode = false;
                            targetNode = getNodeFromName(val); 
                            if(targetNode)
                                targetNode.targetNode = true;
                        }}
                    />
                </li>
            </div>
        </div>
    </div>
</main>

<style>
    :root {
        --toolbar-width: 5rem;
    }

    main {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #242424;
    }

    #inspectorContainer {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 20%;
        height: 100%;
        background-color: #1f1f1f;
        margin-right: 1rem;
        color: #ededed;
    }

    #left {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
    }

    #toolbar {
        display: flex;
        position: absolute;
        bottom: 0;
        right: 100%;
        width: var(--toolbar-width);
        height: fit-content;
        align-items: flex-end;
    }

    #functionsContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100% - 2rem);
        background-color: #1f1f1f;
        color: #ededed;
        padding: 1rem;
    }

    #functionOptions {
        margin-top: 2rem;
        flex-grow: 1;
    }

    .panelLabel {
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
        width: 100%;
        height: 100%;
    }

    #deleteButton {
        position: absolute;
        bottom: 0;
        padding: 2rem;
        background-color: #242424;
        color: #ededed;
        font-size: 16pt;
        border: 1px solid #ededed;
        width: 100%;
    }

    #deleteButton:hover {
        background-color: #ededed;
        color: #242424;
    }

</style>

<svelte:window 
    on:keydown={INPUT.handleKeyDown} 
    on:keyup={INPUT.handleKeyUp} 
/>
