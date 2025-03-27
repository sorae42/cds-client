<script lang="ts">
	const { name, label, type = 'text', value = '', placeholder = '', required = false } = $props();
</script>

<div class="my-4">
	<label for={name} class="label-input">{label}</label>
	<input {type} id={name} {name} {value} {placeholder} {required} class="input" />
</div>
