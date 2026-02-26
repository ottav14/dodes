<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let items = [];
	const dispatch = createEventDispatcher();
	let open = false;
	export let value;
    let hovered = false;

	const handleDropButton = () => {
		open = !open;
	}

	const setVal = (val, e) => {
		value = val;
		open = false;
		dispatch('mousedown', e);
	}

	onMount(() => {
		value = items[0];
	});

    const handleMouseEnter = () => {
        hovered = true;
    }

    const handleMouseLeave = () => {
        hovered = false;
    }

</script>

<main>
	<div id="root">
        <div id="selected">{value}</div>
        <button 
            on:mousedown={handleDropButton} 
            id="dropButton"
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 -960 960 960" fill={hovered ? '#1f1f1f' : '#ededed'}><path d="M480-360 280-560h400L480-360Z"/></svg>
        </button>
		{#if open}
			<div id="items">
				{#each items as item}
					<button on:mousedown={(e) => setVal(item, e)} class="itemButton"><li>{item}</li></button>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	#root {
		display: flex;
		justify-content: space-between;
		position: relative;
		background-color: #242424;
		color: #fff;
		list-style: none;
		width: 20rem;
		height: 4rem;
	}

	#selected {
		flex-grow: 1;
		display: flex;
		align-items: center;
		text-align: left;
		background-color: #242424;
		color: #ededed;
		font-size: 24pt;
		border: none;
		padding: 1rem;
	}


	#items {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: calc(100% + 1px);
		left: -2px;
		width: 100%;
		border-right: 1px solid #1f1f1f;
		border-left: 1px solid #1f1f1f;
		border-bottom: 1px solid #1f1f1f;
	}

	.itemButton {
		display: flex;
		align-items: center;
		text-align: left;
		background-color: #242424;
		color: #ededed;
		font-size: 24pt;
		border: none;
		padding: 1rem;
	}

	.itemButton:hover {
        color: #000000;
		background-color: #ededed;
	}

	#dropButton {
		background-color: #242424;
		height: 100%;
		aspect-ratio: 1 / 1;
		border: none;
		border-left: 1px solid #1f1f1f;
	}

	#dropButton:hover {
		background-color: #ededed;
	}
</style>
