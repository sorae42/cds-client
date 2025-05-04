<script lang="ts">
	import { page } from '$app/state';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { Activity, ClipboardList, LandPlot, Star, User } from 'lucide-svelte';

	let pathname = $state(page.url.pathname);

	let { isAdmin } = $props();

	function isActiveRoute(route: string): boolean {
		return pathname.startsWith(route);
	}
</script>

<Navigation.Rail expanded={true} bind:value={pathname} classes="w-78 fixed z-[5]">
	{#snippet tiles()}
		<Navigation.Tile
			labelExpanded="Danh sách tiêu chí"
			href="/criterias"
			id="/criterias"
			classes={isActiveRoute('/criterias') ? 'border-l-4 border-primary-500' : ''}
		>
			<ClipboardList />
		</Navigation.Tile>

		<Navigation.Tile labelExpanded="Đánh giá" href="#" id="#">
			<Star />
		</Navigation.Tile>
		{#if isAdmin}
			<!-- Replace when fix pushed -->
			<hr class="bg-black w-full" />
			<Navigation.Tile
				labelExpanded="Quản lý tài khoản"
				href="/management/account"
				id="/management/account"
				classes={isActiveRoute('/management/account') ? 'border-l-4 border-primary-500' : ''}
			>
				<User />
			</Navigation.Tile>
			<Navigation.Tile
				labelExpanded="Quản lý đơn vị"
				href="/management/units"
				id="/management/unit"
				classes={isActiveRoute('/management/units') ? 'border-l-4 border-primary-500' : ''}
			>
				<LandPlot />
			</Navigation.Tile>

			<Navigation.Tile
				labelExpanded="Quản lý tiêu chí"
				href="/management/criterias"
				id="/management/criterias"
				classes={isActiveRoute('/management/criterias') ? 'border-l-4 border-primary-500' : ''}
			>
				<ClipboardList />
			</Navigation.Tile>
			<Navigation.Tile
				labelExpanded="Quản lý kỳ đánh giá"
				href="/management/ratings"
				id="/management/ratings"
				classes={isActiveRoute('/management/ratings') ? 'border-l-4 border-primary-500' : ''}
			>
				<Star />
			</Navigation.Tile>
			<hr class="bg-black w-full" />
			<Navigation.Tile
				labelExpanded="Nhật kí hoạt động"
				href="/management/activities"
				id="/management/activities"
				classes={isActiveRoute('/management/activities') ? 'border-l-4 border-primary-500' : ''}
			>
				<Activity />
			</Navigation.Tile>
		{/if}
	{/snippet}
</Navigation.Rail>
