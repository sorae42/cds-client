<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { Settings, User } from 'lucide-svelte';
</script>

<Navigation.Rail expanded={true}>
	{#snippet tiles()}
		<Navigation.Tile labelExpanded="Quản lý tài khoản" href="/account">
			<User />
		</Navigation.Tile>
	{/snippet}
	{#snippet footer()}
		<Navigation.Tile labelExpanded="Cài đặt" href="/settings" title="Settings">
			<Settings />
		</Navigation.Tile>
	{/snippet}
</Navigation.Rail>
