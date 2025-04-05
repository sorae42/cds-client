<script lang="ts">
	const {
		name,
		label,
		type = 'text',
		value = '',
		placeholder = '',
		required = false,
		classes = ''
	} = $props();
</script>

<div class="my-4">
	<label for={name} class="label-input">{label} <i>{required ? '(bắt buộc)' : ''}</i></label>
	<input {type} id={name} {name} {value} {placeholder} {required} class="input {classes}" />
</div>
