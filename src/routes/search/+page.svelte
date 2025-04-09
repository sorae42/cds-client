<script lang="ts">
	import { Search } from 'lucide-svelte';
</script>

<div class="p-8">
	<form method="POST" action="?/search">
		<div class="input-group grid-cols-[auto_1fr_auto]">
			<div class="ig-cell preset-tonal">
				<Search size={16} />
			</div>
			<input class="ig-input" type="search" placeholder="Tìm kiếm kết quả..." />
			<button class="ig-btn preset-filled">Tìm</button>
		</div>
	</form>
</div>
