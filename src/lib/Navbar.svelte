<script lang="ts">
	import { page } from '$app/state';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import {
		Activity,
		ClipboardList,
		FolderKanban,
		Handshake,
		LandPlot,
		Star,
		User,
		Users
	} from 'lucide-svelte';

	let pathname = $state(page.url.pathname);

	let { isAdmin, isChair } = $props();

	function isActiveRoute(route: string): boolean {
		return pathname.startsWith(route);
	}
</script>

<Navigation.Rail
	expanded={true}
	value={pathname}
	onValueChange={(p) => (pathname = p)}
	classes="w-78 fixed z-[5]"
>
	{#snippet tiles()}
		<Navigation.Tile
			labelExpanded="Tổng quan"
			href="/overview"
			id="/overview"
			classes={isActiveRoute('/overview') ? 'border-l-4 border-primary-500' : ''}
		>
			<FolderKanban />
		</Navigation.Tile>
		<Navigation.Tile
			labelExpanded="Danh sách tiêu chí"
			href="/criterias"
			id="/criterias"
			classes={isActiveRoute('/criterias') ? 'border-l-4 border-primary-500' : ''}
		>
			<ClipboardList />
		</Navigation.Tile>

		<Navigation.Tile
			labelExpanded="Đánh giá"
			href="/reviews"
			id="/reviews"
			classes={isActiveRoute('/reviews') ? 'border-l-4 border-primary-500' : ''}
		>
			<Star />
		</Navigation.Tile>
		<hr class="bg-black w-full" />
		<Navigation.Tile
			labelExpanded="Hội đồng thẩm định"
			href="/finalreviews"
			id="/finalreviews"
			classes={isActiveRoute('/finalreviews') ? 'border-l-4 border-primary-500' : ''}
		>
			<Handshake />
		</Navigation.Tile>

		{#if isAdmin}
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
				labelExpanded="Quản lý hội đồng"
				href="/management/councils"
				id="/management/councils"
				classes={isActiveRoute('/management/councils') ? 'border-l-4 border-primary-500' : ''}
			>
				<Users />
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
