<script lang="ts">
	const { children, action, id = 0 } = $props();
</script>

<form {action} class="p-4">
	<input type="hidden" name="id" value={id} />
	{@render children()}
	<div>
		<button class="btn preset-filled-primary-500">Cập nhật</button>
		<a class="btn preset-outlined-surface-500" href="../..">Huỷ</a>
	</div>
</form>
