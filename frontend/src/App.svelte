<script lang="ts">
    import { onMount } from 'svelte';
    import * as GLOBAL from './global.ts';
    import * as INPUT from './input.ts';
    import Connection from './Connection.ts';
    import Node from './Node.ts';
    import * as NODE from './Node.ts';
    import Input from './components/Input.svelte';
    import ItemWidget from './components/ItemWidget.svelte';

    let selectedNode: Node | null = null;
    let selectedConnection: Connection | null = null;
    
    const handleResize = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if(canvas && ctx) {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
    }

    const displayLoop = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        selectedNode = INPUT.getSelectedNode();
        selectedConnection = INPUT.getSelectedConnection();

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
            NODE.createNode(cw/3, ch/2, 10, 'a');
            NODE.createNode(2*cw/3, ch/2, 5, 'b');

            displayLoop();
        }
    });
</script>

<main>
    {#if selectedConnection || selectedNode}
        <div id="inspectorContainer">
            <p id="inspectorLabel">Inspector</p>
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
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        background-color: #242424;
    }

    #inspectorContainer {
        position: absolute;
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
        width: 100%;
        height: 100%;
    }

    #deleteButton {
        position: absolute;
        bottom: 0;
        padding: 2rem;
        background-color: #242424;
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
