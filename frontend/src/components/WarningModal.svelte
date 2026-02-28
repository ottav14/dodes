<script lang="ts">
    import SVGButton from './SVGButton.svelte';

    export let onClose: () => void;
    export let onConfirm: () => void;
    let saveNames: (string | null)[];

    const updateSaveNames = () => {
        saveNames = [];
        for (let i = 0; i < localStorage.length; i++)
            saveNames.push(localStorage.key(i));
    }
    updateSaveNames();
</script>

<main>
    <div id="container">
        <div id="closeButton">
            <SVGButton 
                 title="Close" 
                 path="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" 
                 onClick={onClose}
            />
        </div>
        <h1>Warning</h1>
        <p>All node values will be deleted</p>
        <SVGButton 
             title="Confirm" 
             path="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" 
             onClick={onConfirm}
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
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        width: 30rem;
        height: 20rem;
        background-color: #242424;
    }

    h1 {
        font-size: 32pt;
        color: #f00;
    }

    p {
        font-size: 16pt;
        color: #ededed;
    }

    #closeButton {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
