<script>
    export let label;
</script>

<main>
    <p>{label}</p>
    <button>
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
    }

    p {
        padding-left: 0.5rem;
        margin: 0;
    }

    button {
        height: 100%;
        aspect-ratio: 1 / 1;
        background-color: #242424;
        border-left: 1px solid #ededed;
        font-size: 16pt;
    }
</style>
