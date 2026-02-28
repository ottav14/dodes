<script lang="ts">
    import SVGButton from './SVGButton.svelte';
    import Input from './lib/Input.svelte';
    import Node from '../Node.ts';
    import Connection from '../Connection.ts';
    import * as GLOBAL from '../global.ts';

    let name: string;
    let saveNames: (string | null)[];

    const updateSaveNames = () => {
        saveNames = [];
        for (let i = 0; i < localStorage.length; i++)
            saveNames.push(localStorage.key(i));
    }
    updateSaveNames();

    const handleClose = () => {
        GLOBAL.setMode(null);
    }

    const handleDelete = (key: string | null) => {
        if(key) {
            localStorage.removeItem(key);
            updateSaveNames();
        }
    }

    const handleSave = () => {
        const nodeJSON = [];
        for(const node of GLOBAL.nodes) {
            nodeJSON.push({
                'name': node.name,
                'value': node.value,
                'x': node.x,
                'y': node.y,
                'startNode': node.startNode,
                'targetNode': node.targetNode,
            });
        }

        const connectionJSON = [];
        for(const connection of GLOBAL.connections) {
            connectionJSON.push({
                'a': connection.a.name,
                'b': connection.b.name,
                'weight': connection.weight
            });
        }

        const saveString = JSON.stringify({
            'nodes': nodeJSON,
            'connections': connectionJSON
        });

        localStorage.setItem(name, saveString);
        updateSaveNames();
    }

    const handleOpen = (saveName: string) => {
        const json = localStorage.getItem(saveName);
        if(json) {
            const save = JSON.parse(json);
            const nodes = [];
            for(const node of save.nodes) {
                const n = new Node(node.x, node.y, node.value, node.name)
                n.connections = new Set();
                n.startNode = node.startNode;
                n.targetNode = node.targetNode;
                nodes.push(n);
            }

            const connections = [];
            for(const connection of save.connections) {
                let a, b;
                for(const node of nodes) {
                    if(connection.a === node.name)
                        a = node;
                    if(connection.b === node.name)
                        b = node;
                    if(a && b) {
                        connections.push(new Connection(a, b, connection.weight));
                        a.connections.add(b);
                        b.connections.add(a);
                        break;
                    }
                }
            }

            GLOBAL.setNodes(nodes);
            GLOBAL.setConnections(connections);
        }

    }
</script>

<main>
    <div id="container">
        <div id="closeButton">
            <SVGButton 
                 title="Close" 
                 path="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" 
                 onClick={handleClose}
            />
        </div>
        <div id="saves">
            {#each saveNames as saveName}
            {#if saveName}
                <div class="saveContainer">
                    <p class="saveLabel">{saveName}</p>
                    <SVGButton 
                         title="Open" 
                         path="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" 
                         onClick={() => handleOpen(saveName)}
                         size={4}
                     />
                    <SVGButton 
                         title="Delete" 
                         path="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" 
                         onClick={() => handleDelete(saveName)}
                         size={4}
                     />
                </div>
            {/if}
            {/each}
        </div>
        <Input 
             onInput={(value) => name = value} 
             width="10rem"
        />
        <SVGButton 
             title="Save" 
             path="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" 
             onClick={handleSave}
        />
    </div>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        background-color: #0009;
    }

    #container {
        position: relative;
        display: flex;
        align-items: center;
        padding-right: 3rem;
        flex-direction: column;
        width: 50rem;
        height: 30rem;
        background-color: #242424;
    }

    .saveContainer {
        width: 100%;
        height: 4rem;
        display: flex;
        margin: 1rem;
        padding-left: 1rem;
        padding-top: 1px;
        background-color: #1f1f1f;
    }

    .saveLabel {
        flex-grow: 1;
        color: #ededed;
        font-size: 16pt;
    }

    #saves {
        padding-top: 5rem;
        width: 100%;
        flex-grow: 1;
    }

    #closeButton {
        position: absolute;
        right: 0;
    }
</style>
