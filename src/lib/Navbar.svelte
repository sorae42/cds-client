<script lang="ts">
	import { page } from '$app/state';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { ClipboardList, LandPlot, Star, User } from 'lucide-svelte';

	let pathname = $state(page.url.pathname);

	// place holder
	let isAdmin = true;
</script>

<Navigation.Rail expanded={true} bind:value={pathname} classes="w-78 fixed z-[5]">
	{#snippet tiles()}
		<Navigation.Tile labelExpanded="Danh sách tiêu chí" href="/criterias" id="/criterias">
			<ClipboardList />
		</Navigation.Tile>

		<Navigation.Tile labelExpanded="Đánh giá" href="#" id="#">
			<Star />
		</Navigation.Tile>

		{#if isAdmin}
			<hr class="bg-black w-full" />
			<Navigation.Tile labelExpanded="Quản lý đơn vị" href="/management/area" id="/management/area">
				<LandPlot />
			</Navigation.Tile>

			<Navigation.Tile
				labelExpanded="Quản lý tài khoản"
				href="/management/account"
				id="/management/account"
			>
				<User />
			</Navigation.Tile>
			<Navigation.Tile
				labelExpanded="Quản lý tiêu chí"
				href="/management/criterias"
				id="/management/criterias"
			>
				<ClipboardList />
			</Navigation.Tile>
			<Navigation.Tile
				labelExpanded="Quản lý kỳ đánh giá"
				href="/management/ratings"
				id="/management/ratings"
			>
				<Star />
			</Navigation.Tile>
		{/if}
	{/snippet}
</Navigation.Rail>
