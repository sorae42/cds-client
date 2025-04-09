<script lang="ts">
	const { children, id = 0 } = $props();
</script>

<form action={id === 0 ? '?/create' : '?/update'} method="POST" class="p-8">
	<input type="hidden" name="id" value={id} />
	{@render children()}
	<div class="flex justify-between gap-4 [&>*]:w-full">
		<button class="btn preset-filled-primary-500">Cập nhật</button>
		<a class="btn preset-outlined-surface-500" href="../..">Huỷ</a>
	</div>
</form>
