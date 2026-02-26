<script lang="ts">
    export let value: string = '';
    export let onInput: (value: string) => void;
    export let width: string = '4rem';
    export let height: string = '2rem';
    export let fontSize: string = '16pt';
</script>

<main>
    <input 
        type="text" 
        value={value}
        on:input={(e) => {
            const target = e.target as HTMLElement;
            onInput(target.value);
        }}
        style="width: {width}; height: {height}; font-size: {fontSize};"
    />
</main>

<style>
    input {
        background-color: #242424;
        border: 1px solid #ededed;
        color: #ededed;
        padding: 0;
    }
</style>
