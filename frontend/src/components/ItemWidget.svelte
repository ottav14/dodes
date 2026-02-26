<script>
    export let label;
    export let onDelete;
</script>

<main>
    <p>{label}</p>
    <button on:click={() => onDelete(label)}>
        x
    </button>
</main>

<style>
    main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 8rem;
        height: 2rem;
        border: 1px solid #ededed;
        margin-bottom: 1rem;
        color: #ededed;
    }

    p {
        padding-left: 0.5rem;
        margin: 0;
    }

    button {
        height: 100%;
        aspect-ratio: 1 / 1;
        background-color: #1f1f1f;
        border-left: 1px solid #ededed;
        font-size: 16pt;
        color: #ededed;
    }

    button:hover {
        background-color: #ededed;
        color: #1f1f1f;
    }
</style>
