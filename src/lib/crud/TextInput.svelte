<script lang="ts">
    const {
        name,
        label,
        type = 'text',
        value = '',
        placeholder = '',
        required = false,
        classes = '',
        multiline = false,
        rows = 3
    } = $props();
</script>

<div class="mb-4">
    <label for={name} class="label-input">
        {label} <i>{required ? '(bắt buộc)' : ''}</i>
    </label>
    
    {#if multiline}
        <textarea
            id={name}
            {name}
            {value}
            {rows}
            {placeholder}
            {required}
            class="textarea {classes}"
        ></textarea>
    {:else}
        <input
            {type}
            id={name}
            {name}
            {value}
            {placeholder}
            {required}
            class="input {classes}"
        />
    {/if}
</div>
