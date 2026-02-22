<script lang="ts">
    export let value: string;
    export let onInput: (value: string) => void;
</script>

<main>
    <input 
        type="text" 
        value={value}
        on:input={(e) => {
            const target = e.target as HTMLInputElement;
            onInput(target.value);
        }}
    />
</main>

<style>
    input {
        width: 4rem;
        height: 2rem;
        background-color: #242424;
        border: 1px solid #ededed;
        font-size: 16pt;
    }
</style>
