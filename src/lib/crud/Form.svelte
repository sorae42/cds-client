<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toaster } from '$lib/toaster';

	const { children, id = 0 } = $props();

	let disabled: boolean = $state(false);
</script>

<form
	action={id === 0 ? '?/create' : '?/update'}
	method="POST"
	class="p-8"
	use:enhance={() => {
		disabled = true;

		return async ({ result }) => {
			console.log(result);
			toaster.success({ title: 'Cập nhật thành công!', closable: false });
			disabled = false;
			applyAction(result);
		};
	}}
>
	<input type="hidden" name="id" value={id} />
	{@render children()}
	<div class="flex justify-between gap-4 [&>*]:w-full">
		<button class="btn preset-filled-primary-500" {disabled}>Cập nhật</button>
		<a class="btn preset-outlined-surface-500" href="../..">Huỷ</a>
	</div>
</form>
