<script lang="ts">
    export let title = 'Button';
    export let path;
    export let onClick;
    export let size = 5;
    let hovered = false;
</script>

<main>
    <button 
        title={title}
        on:mouseenter={() => hovered = true}
        on:mouseleave={() => hovered = false}
        on:click={onClick}
        style="width: {`${size}rem`}; height: {`${size}rem`};"
    >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={`${size}0px`}
            height={`${size}0px`}
            viewBox="0 -960 960 960" 
            fill={hovered ? '#1f1f1f' : '#ededed'}
        >
            <path d={path} />
        </svg>
    </button>
</main>

<style>
    button {
        background-color: #1f1f1f;
        border: 1px solid #ededed;
        padding: 0;
    }

    button:hover {
        background-color: #ededed;
    }
</style>
